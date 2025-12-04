import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @IsOptional()
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase())
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be in E.164 format',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  school?: string;

  @IsOptional()
  @IsString()
  role?: string = 'student';
}
