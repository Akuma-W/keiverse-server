import { ApiProperty } from '@nestjs/swagger';

export class Role {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'admin' })
  name: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: 5, required: false })
  userCount?: number;
}

export class RoleWithUsers extends Role {
  @ApiProperty({
    example: [
      {
        id: 1,
        username: 'admin_user',
        fullName: 'Admin User',
        email: 'admin@example.com',
      },
    ],
  })
  users: Array<{
    id: number;
    username: string;
    fullName: string;
    email: string;
    isLocked: boolean;
    createdAt: Date;
  }>;
}
