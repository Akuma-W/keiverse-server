import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { ChangePasswordDto, LoginDto, RegisterDto } from './dto';
import { LocalAuthGuard, RefreshJwtGuard } from 'src/common/guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with username & password' })
  @ApiResponse({ status: 200, description: 'Login success' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    // Set refresh token as HTTP-only cookie
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'] as string;
    const result = await this.authService.refreshTokens(refreshToken);

    // Set new refresh token cookie
    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: result.accessToken,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (!req.user || typeof req.user !== 'object') {
      throw new UnauthorizedException('User not found');
    }

    const userId = (req.user as JwtPayload).sub;

    const refreshToken = req.cookies.refresh_token as string;

    await this.authService.logout(userId, refreshToken);

    // Clear refresh token cookie
    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    if (!req.user || typeof req.user !== 'object') {
      throw new UnauthorizedException('User not found');
    }

    const userId = (req.user as JwtPayload).sub;
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @Get('profile')
  @ApiBearerAuth('access-token')
  async getProfile(@Req() req: Request) {
    if (!req.user || typeof req.user !== 'object') {
      throw new UnauthorizedException('User not found');
    }

    const userId = (req.user as JwtPayload).sub;
    return this.authService.getProfile(userId);
  }
}
