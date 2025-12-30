import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

import { NotificationFacade } from '@/infra/notification/notification.facade';
import { RedisService } from '@/infra/redis/redis.service';

import { UsersService } from '../users/users.service';
import { ChangePasswordDto, LoginDto, RegisterDto, VerifyOtpDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RegisterOtp } from './interfaces/register-otp.interface';
import { OtpService } from './otp/otp.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    private readonly redisService: RedisService, // Redis service for managing refresh tokens
    private readonly notifFacade: NotificationFacade,
    private readonly jwtService: JwtService, // JWT service for token generation and verification
    private readonly configService: ConfigService,
  ) {}

  // Register with OTP (simplified)
  async register(dto: RegisterDto) {
    // Check duplicate
    const existed = await this.usersService.findByIndentifier(
      dto.email || dto.phone || dto.username,
    );

    if (existed) {
      throw new BadRequestException('User already exists');
    }

    const otp = this.otpService.generateOtp();

    await this.otpService.saveOtp(
      `otp:register:${dto.username}`,
      { ...dto, otp },
      5 * 60, // 5 minutes
    );

    // Send by email of otp
    const to = dto.email ? dto.email : dto.phone;
    if (!to) {
      throw new BadRequestException('Email or Phone is empty');
    }
    await this.notifFacade.sentOtp(to, otp);

    this.logger.log(`Sending OTP to ${dto.email || dto.phone}`);
    return { message: 'OTP sent successfully!' };
  }

  // Verify OTP
  async verifyOtp(dto: VerifyOtpDto) {
    const { username, otp } = dto;
    const data = await this.redisService.get<RegisterOtp>(
      this.otpKey(username),
    );

    if (!data) {
      throw new BadRequestException('OTP expired or invalid username');
    }

    const { otp: validOtp, ...createUserDto } = data;
    if (validOtp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.otpService.deleteOtp(this.otpKey(username));

    const user = await this.usersService.create(createUserDto);
    this.logger.log(`User registered: ${username}`);

    return user;
  }

  // Login user
  async login(dto: LoginDto) {
    const user = await this.usersService.findByIndentifier(dto.identifier);

    // Check if user exists and is not locked
    if (!user) {
      throw new UnauthorizedException('Invalid credentials: user');
    }
    if (user.isLocked) {
      throw new UnauthorizedException('User is locked');
    }
    // Check password
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials: password');
    }

    return this.generateTokens(user.id, user.role.name);
  }

  // Generate access and refresh tokens
  async generateTokens(userId: number, role: string) {
    const jti = randomUUID();

    const payload: JwtPayload = { sub: userId, jti, role };

    // Unique identifier for the token
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('auth.jwt.accessToken'),
      expiresIn: this.configService.get('auth.jwt.accessExpiresIn'),
    });

    // Unique identifier for the refresh token
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('auth.jwt.refreshToken'),
      expiresIn: this.configService.get('auth.jwt.refreshExpiresIn'),
    });

    // Store refresh token in Redis with expiration
    await this.redisService.set(
      this.refreshKey(payload.sub, payload.jti),
      refreshToken,
      7 * 24 * 60 * 60, // 7 days
    );

    return { accessToken, refreshToken };
  }

  // Refresh tokens
  async refreshTokens(refreshToken: string) {
    const payload: JwtPayload = this.jwtService.verify(refreshToken);

    if (!payload) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const exists = await this.redisService.get<boolean>(
      this.refreshKey(payload.sub, payload.jti),
    );

    if (!exists) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    // rotate token
    await this.redisService.del(this.refreshKey(payload.sub, payload.jti));

    return this.generateTokens(payload.sub, payload.role);
  }

  // Logout user
  async logout(payload: JwtPayload) {
    await this.redisService.del(this.refreshKey(payload.sub, payload.jti));
    return { message: 'Logged out successfully' };
  }

  // Get current user
  async getMe(userId: number) {
    return this.usersService.findOne(userId);
  }

  // Change user password
  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.usersService.findOne(userId);

    // Verify old password
    const match = await bcrypt.compare(dto.oldPassword, user.password);
    if (!match) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      dto.newPassword,
      this.configService.get<number>('auth.bcrypt.saltRounds') || 10,
    );

    // Update user password
    await this.usersService.update(userId, {
      password: hashedPassword,
    });

    this.logger.log(`Password changed for user ${userId}`);
    return { message: 'Password changed successfully' };
  }

  // Util
  private refreshKey(userId: number, jti: string) {
    return `refresh:${userId}:${jti}`;
  }

  private otpKey(username: string) {
    return `otp:register:${username}`;
  }
}
