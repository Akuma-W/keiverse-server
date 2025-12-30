import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Public } from '@/common/decorators/public.decorator';
import { GetUser } from '@/common/decorators/user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import type { JwtPayload } from '@/modules/auth/interfaces/jwt-payload.interface';

import { AuthService } from './auth.service';
import {
  ChangePasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  VerifyOtpDto,
} from './dto';

// Authentication controller handling auth-related endpoints
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register a new user
  @Post('register')
  @Public()
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // Verify OTP before register
  @Post('verify-otp')
  @Public()
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  // Login user with username and password
  @Post('login')
  @Public()
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Refresh access token using refresh token from cookies
  @Post('refresh')
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  // Logout user by invalidating the refresh token
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async logout(@GetUser() user: JwtPayload) {
    return this.authService.logout(user);
  }

  // Me
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  me(@GetUser('sub') userId: number) {
    return this.authService.getMe(userId);
  }

  // Change password
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  changePassword(@GetUser('sub') id: number, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(id, dto);
  }
}
