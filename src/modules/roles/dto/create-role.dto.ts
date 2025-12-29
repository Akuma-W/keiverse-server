import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'teacher', description: 'Role name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(10)
  @Matches(/^[a-zA-Z]+$/, {
    message: 'Role name can only contain letters',
  })
  @Transform(({ value }) => value.trim().toLowerCase())
  name: string;

  @ApiProperty({ example: 'main role', description: 'Role description' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 'permissions', description: 'Role permissions' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];
}
