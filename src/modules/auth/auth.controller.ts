import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { Public } from '@/common/decorators/public.decorator';
import { GetToken } from '@/common/decorators/token.decorator';
import { GetUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import type { JwtPayload } from '@/common/interfaces';

import { AuthService } from './auth.service';
import { ChangePasswordDto, LoginDto, RegisterDto, VerifyOtpDto } from './dto';

// Authentication controller handling auth-related endpoints
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register a new user
  @Post('register/get-otp')
  @Public()
  @ApiOperation({ summary: 'Register new account - send OTP' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // Verify OTP before register
  @Post('register/verify-otp')
  @Public()
  @ApiOperation({ summary: 'Verify OTP to register new account' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  // Login user with username and password
  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login account by username/email/phone' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(dto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // Dev
      sameSite: 'lax',
      path: '/auth/refresh',
    });

    return { user, accessToken };
  }

  // Refresh access token using refresh token from cookies
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh token' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken as string;
    if (!refreshToken) {
      return { accessToken: null };
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refreshTokens(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/auth/refresh',
    });

    return { accessToken };
  }

  // Logout user by invalidating the refresh token
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Logout this account' })
  async logout(
    @GetToken() payload: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(payload);

    res.clearCookie('refreshToken', {
      path: '/auth/refresh',
    });

    return { message: 'Logged out successfully' };
  }

  // Me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  me(@GetUser('id') userId: number) {
    return this.authService.getMe(userId);
  }

  // Change password
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  changePassword(@GetUser('id') id: number, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(id, dto);
  }
}
