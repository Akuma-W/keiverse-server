import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

import { PrismaService } from '@/infra/prisma/prisma.service';

// Repository for managing User entities using Prisma ORM
@Injectable()
export class UsersRepository {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  // Create a new user
  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  // Find a user by ID
  findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  // Find a user by unique fields
  findByUnique(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({ where });
  }

  // Find multiple users with various query parameters
  async findMany(
    where: Prisma.UserWhereInput,
    skip: number,
    take: number,
    cursor?: Prisma.UserWhereUniqueInput,
    orderBy?: Prisma.UserOrderByWithRelationInput,
    include?: Prisma.UserInclude,
  ) {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        cursor,
        orderBy: orderBy ? orderBy : { createdAt: 'desc' },
        include: include ? include : { role: true },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total };
  }

  // Update a user
  update(id: number, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data });
  }

  // Delete a user
  delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
