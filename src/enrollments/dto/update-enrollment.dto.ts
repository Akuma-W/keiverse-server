import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEnrollmentDto } from './create-enrollment.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateEnrollmentDto extends PartialType(CreateEnrollmentDto) {
  @ApiProperty({
    example: 'approved',
    enum: ['pending', 'approved', 'rejected'],
    description: 'Updated enrollment status',
    required: false,
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
