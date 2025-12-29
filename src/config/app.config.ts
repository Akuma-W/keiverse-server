import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  // App
  name: process.env.APP_NAME || 'KEIVerse',
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  version: process.env.APP_VERSION || '1.0',
  // CORS: Client URL
  cors: {
    origins: (process.env.CLIENT_ORIGINS || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  },
  // Swagger
  swagger: {
    path: process.env.SWAGGER_PATH || 'api/docs',
  },
}));
