import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';

export class User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ required: false })
  school?: string;

  @ApiProperty({ required: false })
  parentPhone?: string;

  @ApiProperty()
  roleId: string;

  @ApiProperty({ type: () => Role })
  role?: Role;

  @ApiProperty()
  isLocked: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
