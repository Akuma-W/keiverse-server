import { registerAs } from '@nestjs/config';
import { StringValue } from 'ms';

export default registerAs('auth', () => ({
  // JWT
  jwt: {
    accessToken: process.env.JWT_ACCESS_SECRET,
    refreshToken: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXP as StringValue,
    refreshExpiresIn: process.env.JWT_REFRESH_EXP as StringValue,
  },
  // Bcrypt: Hashing
  bcrypt: {
    saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 10),
  },
  // Cookie
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  },
}));
