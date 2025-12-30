import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

// DTO for creating a new user
export class CreateUserDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 'student01',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'StrongP@ssw0rd!',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'Nguyen Van A',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  fullName: string;

  @ApiPropertyOptional({
    description: 'Email address of the user',
    example: 'student01@gmail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the user',
    example: '0123456789',
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber('VN')
  phone?: string;

  @ApiPropertyOptional({
    description: 'School or institution the user is affiliated with',
    example: 'University of Information Technology, VNU HCM',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  school?: string;

  @ApiPropertyOptional({ description: 'Role ID of the user', example: 2 })
  @IsOptional()
  @IsInt()
  roleId?: number;

  @ApiPropertyOptional({
    description: 'Avatar URL of the user',
    example: 'http://example.com/avatar.jpg',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Indicates whether the user account is locked',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isLocked?: boolean = false;
}
