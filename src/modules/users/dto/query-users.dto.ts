import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

// DTO for querying users with filters and pagination
export class QueryUsersDto {
  @ApiPropertyOptional({
    description: 'Keyword to search for users by username or full name',
    example: 'student',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({
    description: 'Role of the users to filter by',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  roleId?: number;

  @ApiPropertyOptional({
    description: 'School or institution to filter users by',
    example: 'ABC University',
  })
  @IsOptional()
  @IsString()
  school?: string;

  @ApiPropertyOptional({
    description: 'Filter users by their locked status',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isLocked?: boolean;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of users to return per page',
    default: 10,
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 10;
}
