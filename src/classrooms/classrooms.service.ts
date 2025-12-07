import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { ClassroomsRepository } from './repositories/classrooms.repository';
import { EnrollmentsRepository } from '../enrollments/repositories/enrollments.repository';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { JoinClassroomDto } from './dto/join-classroom.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ClassroomsService {
  constructor(
    private classroomsRepository: ClassroomsRepository,
    private enrollmentsRepository: EnrollmentsRepository,
  ) {}

  /**
   * Create a new classroom
   */
  async create(createClassroomDto: CreateClassroomDto, teacherId: number) {
    // Generate unique class code
    const code = this.generateClassCode();
    // const { termStart, termEnd } = createClassroomDto;

    const classroom = await this.classroomsRepository.create({
      ...createClassroomDto,
      code,
      teacher: { connect: { id: teacherId } },
    });

    // Auto-enroll teacher as teacher role
    await this.enrollmentsRepository.create({
      user: { connect: { id: teacherId } },
      classroom: { connect: { id: classroom.id } },
      roleIn: 'teacher',
      status: 'approved',
    });

    return classroom;
  }

  /**
   * Find all classrooms with filtering and pagination
   */
  async findAll(args?: Prisma.ClassroomFindManyArgs) {
    const [classrooms, total] = await Promise.all([
      this.classroomsRepository.findMany({
        ...args,
        include: {
          teacher: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
          _count: {
            select: {
              enrollments: {
                where: { status: 'approved' },
              },
            },
          },
        },
      }),
      this.classroomsRepository.count({ where: args?.where }),
    ]);

    return {
      data: classrooms,
      total,
      page: args?.skip && args?.take ? args.skip / args.take + 1 : 1,
      limit: args?.take,
      totalPages: args?.take ? Math.ceil(total / args.take) : 1,
    };
  }

  /**
   * Find a classroom by ID
   */
  async findOne(id: number, includeTeacher = false) {
    const classroom = await this.classroomsRepository.findUnique({
      where: { id },
      include: includeTeacher
        ? {
            teacher: {
              select: {
                id: true,
                username: true,
                fullName: true,
                email: true,
              },
            },
          }
        : undefined,
    });

    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }

    return classroom;
  }

  /**
   * Update a classroom
   */
  async update(
    id: number,
    updateData: Prisma.ClassroomUpdateInput,
    userId: number,
  ) {
    // Check if classroom exists and user is teacher
    const classroom = await this.classroomsRepository.findUnique({
      where: { id },
    });

    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }

    if (classroom.teacherId !== userId) {
      throw new ForbiddenException(
        'Only the teacher can update this classroom',
      );
    }

    return this.classroomsRepository.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete a classroom
   */
  async remove(id: number, userId: number) {
    // Check if classroom exists and user is teacher
    const classroom = await this.classroomsRepository.findUnique({
      where: { id },
    });

    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${id} not found`);
    }

    if (classroom.teacherId !== userId) {
      throw new ForbiddenException(
        'Only the teacher can delete this classroom',
      );
    }

    return this.classroomsRepository.delete({
      where: { id },
    });
  }

  /**
   * Join a classroom using code
   */
  async joinClassroom(joinClassroomDto: JoinClassroomDto, userId: number) {
    const { code } = joinClassroomDto;

    // Find classroom by code
    const classroom = await this.classroomsRepository.findByCode(code);
    if (!classroom) {
      throw new NotFoundException('Classroom not found with this code');
    }

    // Check if user is already enrolled
    const existingEnrollment = await this.enrollmentsRepository.findUnique({
      where: {
        userId_classId: {
          userId,
          classId: classroom.id,
        },
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('You are already enrolled in this classroom');
    }

    // Create enrollment with pending status
    return this.enrollmentsRepository.create({
      user: { connect: { id: userId } },
      classroom: { connect: { id: classroom.id } },
      roleIn: 'student',
      status: 'pending',
    });
  }

  /**
   * Get classroom members
   */
  async getMembers(classId: number, userId: number) {
    // Check user access to classroom
    await this.checkUserAccess(classId, userId);

    const enrollments = (await this.enrollmentsRepository.findMany({
      where: {
        classId,
        status: 'approved',
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
          },
        },
      },
    })) as Prisma.EnrollmentGetPayload<{
      include: {
        user: {
          select: {
            id: true;
            username: true;
            fullName: true;
            email: true;
          };
        };
      };
    }>[];

    return enrollments.map((enrollment) => ({
      userId: enrollment.userId,
      roleIn: enrollment.roleIn,
      status: enrollment.status,
      joinedAt: enrollment.joinedAt,
      user: enrollment.user,
    }));
  }

  /**
   * Check if user has access to classroom
   */
  async checkUserAccess(classId: number, userId: number) {
    // Check if user is teacher of classroom
    const classroom = await this.classroomsRepository.findUnique({
      where: { id: classId },
    });

    if (classroom?.teacherId === userId) {
      return true;
    }

    // Check if user has approved enrollment
    const enrollment = await this.enrollmentsRepository.findUnique({
      where: {
        userId_classId: {
          userId,
          classId,
        },
        status: 'approved',
      },
    });

    if (!enrollment) {
      throw new ForbiddenException('You do not have access to this classroom');
    }

    return true;
  }

  /**
   * Generate unique class code
   */
  private generateClassCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }
}
