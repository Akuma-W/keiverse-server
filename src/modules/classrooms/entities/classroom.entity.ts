import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/modules/users/entities/user.entity';

export class Classroom {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  teacherId: string;

  @ApiProperty({ type: () => User })
  teacher?: User;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
