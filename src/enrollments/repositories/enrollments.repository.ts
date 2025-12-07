import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class EnrollmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.EnrollmentCreateInput) {
    return this.prisma.enrollment.create({ data });
  }

  async findUnique(args: Prisma.EnrollmentFindUniqueArgs) {
    return this.prisma.enrollment.findUnique(args);
  }

  async findMany(args: Prisma.EnrollmentFindManyArgs) {
    return this.prisma.enrollment.findMany(args);
  }

  async update(args: Prisma.EnrollmentUpdateArgs) {
    return this.prisma.enrollment.update(args);
  }

  async delete(args: Prisma.EnrollmentDeleteArgs) {
    return this.prisma.enrollment.delete(args);
  }

  async count(args: Prisma.EnrollmentCountArgs) {
    return this.prisma.enrollment.count(args);
  }

  async getClassroomEnrollments(classId: number, status?: string) {
    const where: Prisma.EnrollmentWhereInput = { classId };
    if (status) {
      where.status = status;
    }

    return this.prisma.enrollment.findMany({
      where,
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
      orderBy: { joinedAt: 'desc' },
    });
  }

  async getUserEnrollments(userId: number, status?: string) {
    const where: Prisma.EnrollmentWhereInput = { userId };
    if (status) {
      where.status = status;
    }

    return this.prisma.enrollment.findMany({
      where,
      include: {
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
      orderBy: { joinedAt: 'desc' },
    });
  }

  async updateEnrollmentStatus(
    id: number,
    status: 'pending' | 'approved' | 'rejected',
  ) {
    return this.prisma.enrollment.update({
      where: { id },
      data: { status },
    });
  }

  async checkUserEnrollment(userId: number, classId: number) {
    return this.prisma.enrollment.findUnique({
      where: {
        userId_classId: {
          userId,
          classId,
        },
      },
    });
  }
}
