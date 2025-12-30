import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    description: 'Username send otp',
    example: 'student01',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'OTP 6-digit',
    example: '123456',
  })
  @IsString()
  otp: string;
}
