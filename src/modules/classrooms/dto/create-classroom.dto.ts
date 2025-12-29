import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateClassroomDto {
  @ApiProperty({ example: 'Introduction to Programming' })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiProperty({ example: 'Learn programming basics', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Start date of the term (ISO Date)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  termStart?: Date;

  @ApiProperty({
    example: '2025-05-31T23:59:59.000Z',
    description: 'End date of the term (ISO Date)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  termEnd?: Date;
}
