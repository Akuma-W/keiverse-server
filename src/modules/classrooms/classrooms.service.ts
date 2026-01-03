import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Prisma } from 'generated/prisma/client';

import { Role } from '@/common/enums/roles.enum';
import { AuthUser } from '@/common/interfaces/auth-user.interface';

import {
  CreateClassroomDto,
  QueryClassroomsDto,
  UpdateClassroomDto,
} from './dto';
import { ClassroomsRepository } from './repositories/classrooms.repository';

@Injectable()
export class ClassroomsService {
  private readonly logger = new Logger(ClassroomsService.name);

  constructor(private classroomsRepo: ClassroomsRepository) {}

  // Create a new classroom
  async create(dto: CreateClassroomDto, user: AuthUser) {
    const { teacherId, ...rest } = dto;
    // Logic between teacher and admin
    if (user.role === Role.ADMIN && !teacherId) {
      throw new BadRequestException('TeacherId is required');
    }
    const id = user.role === Role.ADMIN ? teacherId : user.id;
    console.log('Teacher id: ', id);
    console.log('User: ', user);

    // Generate unique class code
    const code = this.generateClassCode();

    const classroom = await this.classroomsRepo.create({
      ...rest,
      code,
      teacher: { connect: { id } },
    });

    this.logger.debug(`Classroom created: ${classroom.id}`);
    return classroom;
  }

  // Find all classrooms with filtering and pagination
  async findAll(query: QueryClassroomsDto) {
    const { page, limit, keyword } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ClassroomWhereInput = keyword
      ? {
          title: { contains: keyword, mode: 'insensitive' },
        }
      : {};

    const [data, total] = await Promise.all([
      this.classroomsRepo.findMany(where, skip, limit),
      this.classroomsRepo.count(where),
    ]);

    return {
      data,
      pagination: { total, page, limit },
    };
  }

  // Find a classroom by ID
  async findOne(id: number) {
    const classroom = await this.classroomsRepo.findById(id);
    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }
    return classroom;
  }

  // Find a classroom by code
  async findByCode(code: string) {
    const classroom = await this.classroomsRepo.findByCode(code);
    if (!classroom) {
      throw new NotFoundException(`Classroom with Code ${code} not found`);
    }
    return classroom;
  }

  // Update a classroom
  async update(id: number, dto: UpdateClassroomDto, user: AuthUser) {
    // Check if classroom exists
    const classroom = await this.classroomsRepo.findById(id);
    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }
    // Check user can manager
    if (this.canManagerClassroom(classroom.teacherId, user)) {
      throw new ForbiddenException('No permission to update classroom');
    }

    const updated = await this.classroomsRepo.update(id, dto);
    this.logger.debug(`Classroom updated: ${id}`);
    return updated;
  }

  // Delete a classroom
  async remove(id: number, user: AuthUser) {
    // Check if classroom exists
    const classroom = await this.classroomsRepo.findById(id);
    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }
    // Check user can manager
    if (this.canManagerClassroom(classroom.teacherId, user)) {
      throw new ForbiddenException('No permission to delete classroom');
    }

    await this.classroomsRepo.delete(id);
    this.logger.warn(`Classroom deleted: ${id}`);
    return { message: 'Classroom deleted successfully' };
  }

  // Utils
  private generateClassCode(): string {
    return randomBytes(6).toString('hex').toUpperCase();
  }

  private canManagerClassroom(teacherId: number, user: AuthUser) {
    return user.role !== Role.ADMIN && teacherId !== user.id;
  }
}
