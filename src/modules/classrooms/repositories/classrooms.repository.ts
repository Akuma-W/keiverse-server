import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ClassroomsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.ClassroomCreateInput) {
    return this.prisma.classroom.create({ data });
  }

  async findUnique(args: Prisma.ClassroomFindUniqueArgs) {
    return this.prisma.classroom.findUnique(args);
  }

  async findMany(args: Prisma.ClassroomFindManyArgs) {
    return this.prisma.classroom.findMany(args);
  }

  async update(args: Prisma.ClassroomUpdateArgs) {
    return this.prisma.classroom.update(args);
  }

  async delete(args: Prisma.ClassroomDeleteArgs) {
    return this.prisma.classroom.delete(args);
  }

  async count(args: Prisma.ClassroomCountArgs) {
    return this.prisma.classroom.count(args);
  }

  async findByCode(code: string) {
    return this.prisma.classroom.findUnique({
      where: { code },
      include: {
        teacher: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async getUserClassrooms(userId: number, role?: string) {
    const where: Prisma.ClassroomWhereInput = {
      enrollments: {
        some: {
          userId,
          ...(role && { roleIn: role }),
        },
      },
    };

    return this.prisma.classroom.findMany({
      where,
      include: {
        teacher: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
        enrollments: {
          where: { userId },
          select: {
            roleIn: true,
            status: true,
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
    });
  }
}
