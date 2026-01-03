import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

import { PrismaService } from '@/infra/prisma/prisma.service';

// Repository for managing Classroom entities using Prisma ORM
@Injectable()
export class ClassroomsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Create new classroom
  create(data: Prisma.ClassroomCreateInput) {
    return this.prisma.classroom.create({ data });
  }

  // Find classroom by query
  async findMany(
    where: Prisma.ClassroomWhereInput,
    skip: number,
    take: number,
  ) {
    return this.prisma.classroom.findMany({
      where,
      skip,
      take,
      include: { teacher: true },
    });
  }

  // Find classroom by id
  findById(id: number) {
    return this.prisma.classroom.findUnique({
      where: { id },
      include: { teacher: true },
    });
  }

  // Find classroom by code
  findByCode(code: string) {
    return this.prisma.classroom.findUnique({
      where: { code },
      include: { teacher: true },
    });
  }

  // Update classroom
  update(id: number, data: Prisma.ClassroomUpdateInput) {
    return this.prisma.classroom.update({
      where: { id },
      data,
    });
  }

  // Delete a classroom
  delete(id: number) {
    return this.prisma.classroom.delete({
      where: { id },
    });
  }

  // Count number of classroom
  count(where: Prisma.ClassroomWhereInput) {
    return this.prisma.classroom.count({ where });
  }
}
