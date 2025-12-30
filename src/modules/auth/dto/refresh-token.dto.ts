import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// DTO for refreshing access token
export class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token used to obtain a new access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  refreshToken: string;
}
