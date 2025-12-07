import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';
import { Classroom } from '@/classrooms/entities/classroom.entity';

export class Enrollment {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  classId: number;

  @ApiProperty({
    example: 'student',
    enum: ['student', 'teacher', 'admin'],
  })
  roleIn: string;

  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'approved', 'rejected'],
  })
  status: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  joinedAt: Date;

  @ApiProperty({ type: () => User, required: false })
  user?: User;

  @ApiProperty({ type: () => Classroom, required: false })
  classroom?: Classroom;
}
