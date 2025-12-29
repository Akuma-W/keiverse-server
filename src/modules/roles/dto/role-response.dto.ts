import { ApiProperty } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'student' })
  name: string;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: 5, required: false })
  userCount?: number;
}

export class RoleWithUsersResponseDto extends RoleResponseDto {
  @ApiProperty({
    example: [
      {
        id: 1,
        username: 'john_doe',
        fullName: 'John Doe',
        email: 'john@example.com',
      },
    ],
  })
  users: Array<{
    id: number;
    username: string;
    fullName: string;
    email: string;
  }>;
}

export class RolesListResponseDto {
  @ApiProperty({ type: [RoleResponseDto] })
  data: RoleResponseDto[];

  @ApiProperty({
    example: {
      page: 1,
      limit: 10,
      total: 4,
      totalPages: 1,
    },
  })
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
