import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateClassroomDto {
  @ApiProperty({
    description: 'Classroom name',
    example: 'Introduction to Programming',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional({
    description: 'Classroom description',
    example: 'Learn programming basics',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Start date of the term (ISO Date)',
    example: '2025-09-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  termStart?: Date;

  @ApiPropertyOptional({
    description: 'End date of the term (ISO Date)',
    example: '2025-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  termEnd?: Date;

  @ApiPropertyOptional({
    description: 'Teacher ID (admin only)',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  teacherId?: number;
}
