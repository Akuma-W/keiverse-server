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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ClassroomsService } from './classrooms.service';
import { JwtAuthGuard } from '../common/guards';
import { Roles, CurrentUser } from '../common/decorators';
import { Prisma } from 'generated/prisma/client';
import {
  QueryClassroomsDto,
  CreateClassroomDto,
  JoinClassroomDto,
} from './dto';

@ApiTags('Classrooms')
@ApiBearerAuth('access-token')
@Controller('classrooms')
@UseGuards(JwtAuthGuard)
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  // ---------------------------
  // CREATE CLASSROOM
  // ---------------------------
  @Post()
  @ApiOperation({ summary: 'Create a new classroom' })
  @ApiResponse({ status: 201, description: 'Classroom created' })
  @Roles('teacher', 'admin')
  async create(
    @Body() createClassroomDto: CreateClassroomDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.classroomsService.create(createClassroomDto, userId);
  }

  // ---------------------------
  // FIND ALL CLASSROOMS (ADMIN)
  // ---------------------------
  @Get()
  @ApiOperation({ summary: 'Get all classrooms (search/pagination)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  async findAll(@Query() query: QueryClassroomsDto) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;
    const where: Prisma.ClassroomWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.classroomsService.findAll({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ---------------------------
  // GET CLASSROOMS OF CURRENT USER
  // ---------------------------
  @Get('my')
  @ApiOperation({ summary: 'Get all classrooms of the current user' })
  async getMyClassrooms(@CurrentUser('id') userId: number) {
    return this.classroomsService.findAll({
      where: {
        OR: [
          { teacherId: userId },
          {
            enrollments: {
              some: { userId, status: 'approved' },
            },
          },
        ],
      },
      include: {
        teacher: true,
        _count: { select: { enrollments: true } },
      },
    });
  }

  // ---------------------------
  // JOIN CLASSROOM BY CODE
  // ---------------------------
  @Post('join')
  @ApiOperation({ summary: 'Join a classroom using code' })
  @Roles('student')
  async join(
    @Body() joinClassroomDto: JoinClassroomDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.classroomsService.joinClassroom(joinClassroomDto, userId);
  }

  // ---------------------------
  // CLASSROOM MEMBERS
  // ---------------------------
  @Get(':id/members')
  @ApiOperation({ summary: 'Get classroom members' })
  async getMembers(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.classroomsService.getMembers(id, userId);
  }

  // ---------------------------
  // FIND CLASSROOM BY ID
  // ---------------------------
  @Get(':id')
  @ApiOperation({ summary: 'Get classroom by ID' })
  @ApiResponse({ status: 200, description: 'Classroom found' })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classroomsService.findOne(id, true);
  }

  // ---------------------------
  // UPDATE CLASSROOM
  // ---------------------------
  @Put(':id')
  @ApiOperation({ summary: 'Update classroom' })
  @Roles('teacher', 'admin')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Prisma.ClassroomUpdateInput,
    @CurrentUser('id') userId: number,
  ) {
    return this.classroomsService.update(id, updateData, userId);
  }

  // ---------------------------
  // DELETE CLASSROOM
  // ---------------------------
  @Delete(':id')
  @ApiOperation({ summary: 'Delete classroom' })
  @Roles('teacher', 'admin')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.classroomsService.remove(id, userId);
  }
}
