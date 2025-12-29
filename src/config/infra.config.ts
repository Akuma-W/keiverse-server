import { registerAs } from '@nestjs/config';

export default registerAs('infra', () => ({
  // Database: PostgreSQL
  database: {
    url: process.env.DATABASE_URL || '',
  },
  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    ttl: Number(process.env.REDIS_TTL || 3600),
  },
  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  // Throttler: Rate Limiting
  throttler: {
    ttl: Number(process.env.RATE_LIMIT_TTL || 60),
    limit: Number(process.env.RATE_LIMIT_MAX || 100),
  },
}));
