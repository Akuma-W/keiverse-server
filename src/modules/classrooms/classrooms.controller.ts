import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '@/common/decorators/roles.decorator';
import { GetUser } from '@/common/decorators/user.decorator';
import { Role } from '@/common/enums/roles.enum';
import { RolesGuard } from '@/common/guards/roles.guard';
import type { AuthUser } from '@/common/interfaces/auth-user';

import { ClassroomsService } from './classrooms.service';
import {
  CreateClassroomDto,
  QueryClassroomsDto,
  UpdateClassroomDto,
} from './dto';

@ApiTags('Classrooms')
@ApiBearerAuth('access-token')
@Controller('classrooms')
@UseGuards(RolesGuard)
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  // Create a classroom
  @Post()
  @Roles(Role.TEACHER, Role.ADMIN)
  async create(@Body() dto: CreateClassroomDto, @GetUser() user: AuthUser) {
    return this.classroomsService.create(dto, user);
  }

  // Find all classroom
  @Get()
  async findAll(@Query() query: QueryClassroomsDto) {
    return this.classroomsService.findAll(query);
  }

  // Find classroom by id
  @Get(':id')
  @Roles()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classroomsService.findOne(id);
  }

  // Find classroom by code
  @Get('by-code/:code')
  @Roles()
  async findByCode(@Param('code') code: string) {
    return this.classroomsService.findByCode(code);
  }

  // Update classroom (admin & teacher)
  @Patch(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateClassroomDto,
    @GetUser() user: AuthUser,
  ) {
    return this.classroomsService.update(id, dto, user);
  }

  // Delete classroom
  @Delete(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: AuthUser,
  ) {
    return this.classroomsService.remove(id, user);
  }
}
