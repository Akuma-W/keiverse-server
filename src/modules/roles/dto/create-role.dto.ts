import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

// DTO for creating a new role
export class CreateRoleDto {
  @ApiProperty({
    description: 'Role name',
    example: 'teacher',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  @Transform(({ value }) => value?.toLowerCase())
  name: string;
}
