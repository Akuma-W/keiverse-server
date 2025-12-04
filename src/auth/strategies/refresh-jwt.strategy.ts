import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(private readonly configService: ConfigService) {
    const refreshSecret = configService.get<string>('jwt.refreshSecret');

    if (!refreshSecret) {
      throw new Error('Refresh JWT secret not found in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refresh_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: refreshSecret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.cookies?.refresh_token as string;
    return {
      sub: payload.sub,
      jti: payload.jti,
      refreshToken,
    };
  }
}
