import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { CreateEnrollmentDto } from './create-enrollment.dto';

export class UpdateEnrollmentDto extends PartialType(CreateEnrollmentDto) {
  @ApiPropertyOptional({
    description: 'Updated enrollment status',
    example: 'approved',
    enum: ['pending', 'approved', 'rejected'],
  })
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected'])
  status?: 'pending' | 'approved' | 'rejected';

  @ApiProperty({
    example: 'teacher_assistant',
    description: 'Updated role in classroom',
    required: false,
  })
  @IsOptional()
  @IsEnum(['teacher', 'student', 'admin'])
  roleIn?: 'teacher' | 'student' | 'admin';
}
