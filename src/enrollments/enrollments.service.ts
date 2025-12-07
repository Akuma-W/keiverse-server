import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { EnrollmentsRepository } from './repositories/enrollments.repository';
import { ClassroomsRepository } from '../classrooms/repositories/classrooms.repository';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from './dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class EnrollmentsService {
  constructor(
    private enrollmentsRepository: EnrollmentsRepository,
    private classroomsRepository: ClassroomsRepository,
  ) {}

  /**
   * Create a new enrollment
   */
  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const {
      userId,
      classId,
      roleIn = 'student',
      status = 'pending',
    } = createEnrollmentDto;

    // Check if classroom exists
    const classroom = await this.classroomsRepository.findUnique({
      where: { id: classId },
    });

    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${classId} not found`);
    }

    // Check if user is already enrolled
    const existingEnrollment =
      await this.enrollmentsRepository.checkUserEnrollment(userId, classId);

    if (existingEnrollment) {
      throw new ConflictException('User is already enrolled in this classroom');
    }

    // Create enrollment
    return this.enrollmentsRepository.create({
      user: { connect: { id: userId } },
      classroom: { connect: { id: classId } },
      roleIn,
      status,
    });
  }

  /**
   * Find all enrollments with filtering
   */
  async findAll(args?: Prisma.EnrollmentFindManyArgs) {
    const [enrollments, total] = await Promise.all([
      this.enrollmentsRepository.findMany({
        ...args,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              email: true,
            },
          },
          classroom: {
            select: {
              id: true,
              title: true,
              code: true,
            },
          },
        },
      }),
      this.enrollmentsRepository.count({ where: args?.where }),
    ]);

    return {
      data: enrollments,
      total,
      page: args?.skip && args?.take ? args.skip / args.take + 1 : 1,
      limit: args?.take,
      totalPages: args?.take ? Math.ceil(total / args.take) : 1,
    };
  }

  /**
   * Find an enrollment by ID
   */
  async findOne(id: number) {
    const enrollment = await this.enrollmentsRepository.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        classroom: {
          select: {
            id: true,
            title: true,
            code: true,
            description: true,
            teacher: {
              select: {
                id: true,
                fullName: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    return enrollment;
  }

  /**
   * Update an enrollment
   */
  async update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    const enrollment = await this.enrollmentsRepository.findUnique({
      where: { id },
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    return this.enrollmentsRepository.update({
      where: { id },
      data: updateEnrollmentDto,
    });
  }

  /**
   * Delete an enrollment
   */
  async remove(id: number) {
    const enrollment = await this.enrollmentsRepository.findUnique({
      where: { id },
    });

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    // Prevent removing teacher enrollment
    if (enrollment.roleIn === 'teacher') {
      throw new ForbiddenException('Cannot remove teacher enrollment');
    }

    return this.enrollmentsRepository.delete({
      where: { id },
    });
  }

  /**
   * Get classroom enrollments
   */
  async getClassroomEnrollments(
    classId: number,
    status?: string,
    userId?: number,
  ) {
    // Check if user has access to classroom
    if (userId) {
      const classroom = await this.classroomsRepository.findUnique({
        where: { id: classId },
      });

      if (classroom?.teacherId !== userId) {
        throw new ForbiddenException(
          'Only teacher can view classroom enrollments',
        );
      }
    }

    return this.enrollmentsRepository.getClassroomEnrollments(classId, status);
  }

  /**
   * Get user enrollments
   */
  async getUserEnrollments(userId: number, status?: string) {
    return this.enrollmentsRepository.getUserEnrollments(userId, status);
  }

  /**
   * Approve an enrollment request
   */
  async approveEnrollment(id: number, teacherId: number) {
    const enrollment = (await this.enrollmentsRepository.findUnique({
      where: { id },
      include: { classroom: true },
    })) as Prisma.EnrollmentGetPayload<{
      include: { classroom: true };
    }>;

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    // Check if user is teacher of the classroom
    if (enrollment.classroom.teacherId !== teacherId) {
      throw new ForbiddenException('Only teacher can approve enrollments');
    }

    return this.enrollmentsRepository.updateEnrollmentStatus(id, 'approved');
  }

  /**
   * Reject an enrollment request
   */
  async rejectEnrollment(id: number, teacherId: number) {
    const enrollment = (await this.enrollmentsRepository.findUnique({
      where: { id },
      include: { classroom: true },
    })) as Prisma.EnrollmentGetPayload<{
      include: { classroom: true };
    }>;

    if (!enrollment) {
      throw new NotFoundException(`Enrollment with ID ${id} not found`);
    }

    // Check if user is teacher of the classroom
    if (enrollment.classroom.teacherId !== teacherId) {
      throw new ForbiddenException('Only teacher can reject enrollments');
    }

    return this.enrollmentsRepository.updateEnrollmentStatus(id, 'rejected');
  }

  /**
   * Check if user is enrolled in classroom
   */
  async checkEnrollment(userId: number, classId: number) {
    return this.enrollmentsRepository.checkUserEnrollment(userId, classId);
  }
}
