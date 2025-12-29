import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';

import { PrismaService } from '@/infra/prisma/prisma.service';

// Reporsitory for Role entity
@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new role
  create(data: Prisma.RoleCreateInput) {
    return this.prisma.role.create({ data });
  }

  // Find all roles
  findAll() {
    return this.prisma.role.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  // Find role by id
  findById(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  // Find role by name
  findByName(name: string) {
    return this.prisma.role.findUnique({
      where: { name },
    });
  }

  // Update a role
  update(id: number, data: Prisma.RoleUpdateInput) {
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  // Delete a role
  delete(id: number) {
    return this.prisma.role.delete({
      where: { id },
    });
  }

  // Count users using a specific role
  countUsers(roleId: number) {
    return this.prisma.user.count({
      where: { roleId },
    });
  }
}
