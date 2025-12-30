import { Injectable } from '@nestjs/common';

import { RedisService } from '@/infra/redis/redis.service';

// OTP Services
@Injectable()
export class OtpService {
  constructor(private readonly redis: RedisService) {}

  // Generate OTP when register
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Save OTP
  async saveOtp(key: string, payload: any, ttl = 300) {
    await this.redis.set(key, payload, ttl);
  }

  // Get OTP
  async getOtp<T>(key: string): Promise<T | null> {
    return this.redis.get<T>(key);
  }

  // Delete OTP
  async deleteOtp(key: string) {
    await this.redis.del(key);
  }
}
