import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';
import { RedisService } from '../redis/redis.service';
import { RegisterDto, LoginDto, ChangePasswordDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByUsernameOrEmail(
      registerDto.username,
      registerDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const role = await this.rolesService.findByName(
      registerDto.role ?? 'student',
    );
    if (!role) {
      throw new BadRequestException('Invalid role');
    }

    // Create user
    const user = await this.usersService.create({ ...registerDto });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials: user');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials: username');
    }

    if (user.isLocked) {
      throw new UnauthorizedException('Account is locked');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials: password');
    }

    return this.usersService.sanitizeUser(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.generateTokens(user.id);

    return {
      user,
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });

      // Check if refresh token exists in Redis
      const storedToken = await this.redisService.get(
        `refresh:${payload.sub}:${payload.jti}`,
      );

      if (!storedToken || storedToken !== 'valid') {
        // Token reuse detected - revoke all user's sessions
        await this.revokeAllUserSessions(payload.sub);
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Delete old refresh token
      await this.redisService.del(`refresh:${payload.sub}:${payload.jti}`);

      // Generate new tokens
      return await this.generateTokens(payload.sub);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: number, refreshToken?: string) {
    if (refreshToken) {
      try {
        const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
          secret: this.configService.get('jwt.refreshSecret'),
        });

        await this.redisService.del(`refresh:${userId}:${payload.jti}`);
      } catch {
        // Token might be expired, ignore
      }
    }
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const password = await this.usersService.findPasswordById(userId);

    // Verify old password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

    // Update user password
    await this.usersService.update(userId, {
      password: hashedPassword,
    });

    // Revoke all refresh tokens for security
    await this.revokeAllUserSessions(userId);

    return { message: 'Password changed successfully' };
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    const password = await this.usersService.findPasswordById(userId);
    return { ...user, password };
  }

  private async generateTokens(userId: number) {
    const jti = randomUUID();
    const payload: JwtPayload = { sub: userId, jti };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });

    // Store refresh token in Redis with TTL
    const ttl = 7 * 24 * 60 * 60; // 7 days in seconds
    await this.redisService.set(`refresh:${userId}:${jti}`, 'valid', ttl);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async revokeAllUserSessions(userId: number) {
    const pattern = `refresh:${userId}:*`;
    const keys = await this.redisService.keys(pattern);

    if (keys.length > 0) {
      await this.redisService.del(...keys);
    }
  }
}
