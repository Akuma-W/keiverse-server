import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

// DTO for user login
export class LoginDto {
  @ApiProperty({
    description: 'Username or email or phone number of the user',
    example: 'student123 | student01@gmail.com | 0123456789',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  identifier: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'StrongP@ssw0rd!',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;
}
