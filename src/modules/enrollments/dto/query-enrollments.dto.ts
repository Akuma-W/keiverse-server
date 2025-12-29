import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  IsString,
  Min,
  Max,
  IsEnum,
  IsBoolean,
} from 'class-validator';

export enum EnrollmentStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum EnrollmentRole {
  Teacher = 'teacher',
  Student = 'student',
}

export enum EnrollmentSortBy {
  Id = 'id',
  JoinedAt = 'joinedAt',
  Status = 'status',
  RoleIn = 'roleIn',
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

export class QueryEnrollmentsDto {
  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  classId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId?: number;

  @ApiProperty({ enum: EnrollmentStatus, required: false })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;

  @ApiProperty({ enum: EnrollmentRole, required: false })
  @IsOptional()
  @IsEnum(EnrollmentRole)
  roleIn?: EnrollmentRole;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    enum: EnrollmentSortBy,
    required: false,
    default: EnrollmentSortBy.JoinedAt,
  })
  @IsOptional()
  @IsEnum(EnrollmentSortBy)
  sortBy: EnrollmentSortBy = EnrollmentSortBy.JoinedAt;

  @ApiProperty({
    enum: SortOrder,
    required: false,
    default: SortOrder.Desc,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder: SortOrder = SortOrder.Desc;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeUser: boolean = false;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  includeClassroom: boolean = false;
}
