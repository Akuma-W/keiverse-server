import { ApiProperty } from '@nestjs/swagger';

export class Tokens {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token' })
  refreshToken?: string;

  @ApiProperty({ description: 'Access token expiration time' })
  expiresIn: number;
}
