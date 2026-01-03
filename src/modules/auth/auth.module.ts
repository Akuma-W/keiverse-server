import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { NotificationModule } from '@/infra/notification/notification.module';
import { RedisModule } from '@/infra/redis/redis.module';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { OtpService } from './otp/otp.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    RedisModule,
    PassportModule,
    // Register jwt config
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('auth.jwt.accessToken'),
        signOptions: {
          expiresIn: config.get('auth.jwt.accessExpiresIn'),
        },
      }),
    }),
    NotificationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OtpService],
})
export class AuthModule {}
