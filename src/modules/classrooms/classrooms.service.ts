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
import { AuthUser } from '@/common/interfaces/auth-user';

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
    // Logic between teacher and admin
    if (user.role === Role.ADMIN && !dto.teacherId) {
      throw new BadRequestException('TeacherId is required');
    }
    const teacherId = user.role === Role.ADMIN ? dto.teacherId : user.id;

    // Generate unique class code
    const code = this.generateClassCode();

    const classroom = await this.classroomsRepo.create({
      ...dto,
      code,
      teacher: { connect: { id: teacherId } },
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
  async update(
    id: number,
    dto: UpdateClassroomDto,
    user: { id: number; role: string },
  ) {
    // Check if classroom exists
    const classroom = await this.classroomsRepo.findById(id);
    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }
    // Check user is admin or teacher
    if (this.checkRole(classroom.teacherId, user)) {
      throw new ForbiddenException('No permission to update classroom');
    }

    const updated = await this.classroomsRepo.update(id, dto);
    this.logger.debug(`Classroom updated: ${id}`);
    return updated;
  }

  // Delete a classroom
  async remove(id: number, user: { id: number; role: string }) {
    // Check if classroom exists
    const classroom = await this.classroomsRepo.findById(id);
    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }
    // Check user is admin or teacher
    if (this.checkRole(classroom.teacherId, user)) {
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

  private checkRole(teacherId: number, user: { id: number; role: string }) {
    return user.role !== 'admin' && teacherId !== user.id;
  }
}
