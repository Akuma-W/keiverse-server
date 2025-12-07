import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    include?: Prisma.UserInclude;
  }) {
    const { skip, take, cursor, where, orderBy, include } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  async findOne(params: {
    where: Prisma.UserWhereUniqueInput;
    include?: Prisma.UserInclude;
  }) {
    const { where, include } = params;
    return this.prisma.user.findUnique({ where, include });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
    include?: Prisma.UserInclude;
  }) {
    const { where, data, include } = params;
    return this.prisma.user.update({ where, data, include });
  }

  async delete(params: { where: Prisma.UserWhereUniqueInput }) {
    const { where } = params;
    return this.prisma.user.delete({ where });
  }

  async count(params: { where?: Prisma.UserWhereInput }) {
    const { where } = params;
    return this.prisma.user.count({ where });
  }

  async findByRole(roleName: string) {
    return this.prisma.user.findMany({
      where: {
        role: { name: roleName },
        isLocked: false,
      },
      include: {
        role: true,
      },
    });
  }

  async searchUsers(searchTerm: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: searchTerm, mode: 'insensitive' } },
          { fullName: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        role: true,
      },
    });
  }
}
