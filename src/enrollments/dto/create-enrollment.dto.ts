import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({ example: 1, description: 'User ID to enroll' })
  @IsInt()
  userId: number;

  @ApiProperty({ example: 1, description: 'Classroom ID' })
  @IsInt()
  classId: number;

  @ApiProperty({ example: 'student', description: 'Role in the classroom' })
  @IsEnum(['teacher', 'student', 'admin'])
  @IsOptional()
  roleIn: 'teacher' | 'student' | 'admin';

  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'approved', 'rejected'],
  })
  @IsEnum(['pending', 'approved', 'rejected'])
  @IsOptional()
  status: 'pending' | 'approved' | 'rejected';
}
