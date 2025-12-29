import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  // JWT
  jwt: {
    accessToken: process.env.JWT_ACCESS_SECRET,
    refreshToken: process.env.JWT_REFRESH_SECRET,
    accessExpriesIn: process.env.JWT_ACCESS_EXP || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXP || '7d',
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
