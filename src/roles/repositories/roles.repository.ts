import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new role
  async create(params: {
    data: Prisma.RoleCreateInput;
    include?: Prisma.RoleInclude;
  }) {
    const { data, include } = params;
    return this.prisma.role.create({ data, include });
  }

  // Find multiple roles
  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoleWhereUniqueInput;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput;
    include?: Prisma.RoleInclude;
    select?: Prisma.RoleSelect;
  }) {
    const { skip, take, cursor, where, orderBy, include, select } = params;

    if (select) {
      return this.prisma.role.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        select,
      });
    }

    return this.prisma.role.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include,
    });
  }

  // Find a single role
  async findOne(params: {
    where: Prisma.RoleWhereUniqueInput;
    include?: Prisma.RoleInclude;
    select?: Prisma.RoleSelect;
  }) {
    const { where, include, select } = params;

    if (select) {
      return this.prisma.role.findUnique({ where, select });
    }

    return this.prisma.role.findUnique({ where, include });
  }

  // Update a role
  async update(params: {
    where: Prisma.RoleWhereUniqueInput;
    data: Prisma.RoleUpdateInput;
    include?: Prisma.RoleInclude;
  }) {
    const { where, data, include } = params;
    return this.prisma.role.update({ where, data, include });
  }

  // Delete a role
  async delete(params: { where: Prisma.RoleWhereUniqueInput }) {
    const { where } = params;
    return this.prisma.role.delete({ where });
  }

  // Count roles
  async count(params: { where?: Prisma.RoleWhereInput }) {
    const { where } = params;
    return this.prisma.role.count({ where });
  }

  // Count users with a specific role
  async countUsers(roleId: number): Promise<number> {
    return this.prisma.user.count({
      where: { roleId },
    });
  }

  // Find roles with user counts
  async findRolesWithUserCount() {
    const roles = await this.prisma.role.findMany({
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        id: 'asc',
      },
    });

    return roles.map((role) => ({
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      userCount: role._count.users,
    }));
  }

  // Find or create a role by name
  async findOrCreate(name: string) {
    const role = await this.findOne({
      where: { name: name.toLowerCase() },
    });

    if (role) {
      return role;
    }

    return this.create({
      data: { name: name.toLowerCase() },
    });
  }
}
