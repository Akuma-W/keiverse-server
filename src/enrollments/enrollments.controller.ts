import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, Roles } from '../common/decorators';
import {
  CreateEnrollmentDto,
  QueryEnrollmentsDto,
  UpdateEnrollmentDto,
} from './dto';
import { Enrollment } from './entities/enrollment.entity';
import { Prisma } from 'generated/prisma/client';

@ApiTags('enrollments')
@ApiBearerAuth('access-token')
@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  // -------------------------------------------------------
  // Create enrollment
  // -------------------------------------------------------
  @Post()
  @ApiOperation({ summary: 'Create a new enrollment' })
  @ApiResponse({ status: 201, type: Enrollment })
  @ApiResponse({ status: 409, description: 'User already enrolled' })
  @Roles('admin', 'teacher')
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  // -------------------------------------------------------
  // Get all enrollments
  // -------------------------------------------------------
  @Get()
  @ApiOperation({ summary: 'Get all enrollments' })
  @Roles('admin')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'classId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  findAll(@Query() query: QueryEnrollmentsDto) {
    const { page, limit, status, classId, userId } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.EnrollmentWhereInput = {};
    if (status) where.status = status;
    if (classId) where.classId = classId;
    if (userId) where.userId = userId;

    return this.enrollmentsService.findAll({
      where,
      skip,
      take: limit,
      orderBy: { joinedAt: 'desc' },
    });
  }

  // -------------------------------------------------------
  // Get classroom enrollments
  // -------------------------------------------------------
  @Get('classroom/:classId')
  @ApiOperation({ summary: 'Get classroom enrollments' })
  @Roles('teacher', 'admin')
  @ApiQuery({ name: 'status', required: false })
  getClassroomEnrollments(
    @Param('classId', ParseIntPipe) classId: number,
    @Query('status') status?: string,
    @CurrentUser('id') userId?: number,
  ) {
    return this.enrollmentsService.getClassroomEnrollments(
      classId,
      status,
      userId,
    );
  }

  // -------------------------------------------------------
  // Get user enrollments
  // -------------------------------------------------------
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user enrollments' })
  @Roles('admin', 'teacher')
  @ApiQuery({ name: 'status', required: false })
  getUserEnrollments(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('status') status?: string,
  ) {
    return this.enrollmentsService.getUserEnrollments(userId, status);
  }

  // -------------------------------------------------------
  // Get enrollments of current user
  // -------------------------------------------------------
  @Get('my-enrollments')
  @ApiOperation({ summary: 'Get current user enrollments' })
  @ApiQuery({ name: 'status', required: false })
  getMyEnrollments(
    @CurrentUser('id') userId: number,
    @Query('status') status?: string,
  ) {
    return this.enrollmentsService.getUserEnrollments(userId, status);
  }

  // -------------------------------------------------------
  // Get one enrollment
  // -------------------------------------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get enrollment by ID' })
  @Roles('admin', 'teacher')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.findOne(id);
  }

  // -------------------------------------------------------
  // Update enrollment
  // -------------------------------------------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update enrollment' })
  @Roles('admin', 'teacher')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentsService.update(id, updateEnrollmentDto);
  }

  // -------------------------------------------------------
  // Delete enrollment
  // -------------------------------------------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Delete enrollment' })
  @Roles('admin', 'teacher')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.remove(id);
  }

  // -------------------------------------------------------
  // Approve enrollment request
  // -------------------------------------------------------
  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve enrollment request' })
  @Roles('teacher')
  approve(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') teacherId: number,
  ) {
    return this.enrollmentsService.approveEnrollment(id, teacherId);
  }

  // -------------------------------------------------------
  // Reject enrollment request
  // -------------------------------------------------------
  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject enrollment request' })
  @Roles('teacher')
  reject(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') teacherId: number,
  ) {
    return this.enrollmentsService.rejectEnrollment(id, teacherId);
  }
}
