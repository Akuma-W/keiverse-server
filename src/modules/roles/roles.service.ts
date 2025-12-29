import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RolesRepository } from './repositories/roles.repository';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRolesDto } from './dto/query-roles.dto';
import { Prisma } from 'generated/prisma/client';
import { RoleWithUsers } from './entities/role.entity';

@Injectable()
export class RolesService {
  // Predefined system roles
  private readonly SYSTEM_ROLES = ['admin', 'teacher', 'student', 'user'];
  private readonly IMMUTABLE_ROLES = ['admin', 'teacher', 'student'];

  constructor(private readonly rolesRepository: RolesRepository) {}

  // Create a new role
  async create(createRoleDto: CreateRoleDto) {
    const { name } = createRoleDto;

    // Validate role name
    this.validateRoleName(name);

    // Check if role already exists
    const existingRole = await this.rolesRepository.findOne({
      where: { name },
    });

    if (existingRole) {
      throw new ConflictException(`Role with name '${name}' already exists`);
    }

    try {
      const role = await this.rolesRepository.create({
        data: {
          name: name.toLowerCase(),
        },
      });

      return role;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // Find all roles with pagination and filtering
  async findAll(query: QueryRolesDto) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'id',
      sortOrder = 'asc',
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.RoleWhereInput = {};

    // Add search functionality
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive' as Prisma.QueryMode,
      };
    }

    // Build orderBy clause
    const orderBy: Prisma.RoleOrderByWithRelationInput = {};
    if (sortBy === 'name') {
      orderBy.name = sortOrder;
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else {
      orderBy.id = sortOrder;
    }

    try {
      const [roles, total] = await Promise.all([
        this.rolesRepository.findMany({
          where,
          skip,
          take: limit,
          orderBy,
          include: {
            _count: {
              select: {
                users: true,
              },
            },
          },
        }),
        this.rolesRepository.count({ where }),
      ]);

      return {
        data: roles,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Failed to fetch roles');
    }
  }

  // Find a role by ID
  async findOne(id: number) {
    const role = await this.rolesRepository.findOne({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  // Find a role by name
  async findByName(name: string) {
    const role = await this.rolesRepository.findOne({
      where: { name: name.toLowerCase() },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException(`Role with name '${name}' not found`);
    }

    return role;
  }

  // Update a role
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    // Check if role exists
    const existingRole = await this.findOne(id);

    if (!existingRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Prevent modification of immutable system roles
    if (this.IMMUTABLE_ROLES.includes(existingRole.name)) {
      throw new BadRequestException(
        `Cannot modify system role '${existingRole.name}'`,
      );
    }

    const { name } = updateRoleDto;

    // Validate new role name if provided
    if (name) {
      this.validateRoleName(name);

      // Check if new name already exists
      const duplicateRole = await this.rolesRepository.findOne({
        where: {
          name: name.toLowerCase(),
          NOT: { id },
        },
      });

      if (duplicateRole) {
        throw new ConflictException(`Role with name '${name}' already exists`);
      }
    }

    try {
      const updatedRole = await this.rolesRepository.update({
        where: { id },
        data: {
          ...updateRoleDto,
          ...(name && { name: name.toLowerCase() }),
        },
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
      });

      return updatedRole;
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // Delete a role
  async remove(id: number) {
    // Check if role exists
    const existingRole = await this.findOne(id);

    if (!existingRole) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    // Prevent deletion of system roles
    if (this.IMMUTABLE_ROLES.includes(existingRole.name)) {
      throw new BadRequestException(
        `Cannot delete system role '${existingRole.name}'`,
      );
    }

    // Check if role has users assigned
    const userCount = await this.rolesRepository.countUsers(id);

    if (userCount > 0) {
      throw new BadRequestException(
        `Cannot delete role with ${userCount} user(s) assigned. Reassign users first.`,
      );
    }

    try {
      await this.rolesRepository.delete({ where: { id } });
      return { message: 'Role deleted successfully' };
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  // Get all users with a specific role
  async getUsersWithRole(id: number) {
    const role = (await this.rolesRepository.findOne({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
            isLocked: true,
            createdAt: true,
          },
        },
      },
    })) as unknown as RoleWithUsers;

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role.users;
  }

  // Get count of users with a specific role
  async getUserCount(id: number) {
    const role = await this.findOne(id);

    const count = await this.rolesRepository.countUsers(id);

    return {
      roleId: role.id,
      roleName: role.name,
      userCount: count,
    };
  }

  // Initialize system roles if they don't exist
  async initializeSystemRoles() {
    try {
      for (const roleName of this.SYSTEM_ROLES) {
        const existingRole = await this.rolesRepository.findOne({
          where: { name: roleName },
        });

        if (!existingRole) {
          await this.rolesRepository.create({
            data: { name: roleName },
          });
          console.log(`Created system role: ${roleName}`);
        }
      }
      console.log('System roles initialized successfully');
    } catch (error) {
      console.error('Failed to initialize system roles:', error);
      throw new InternalServerErrorException(
        'Failed to initialize system roles',
      );
    }
  }

  // Get all available roles
  async getAllRoles() {
    try {
      const roles = await this.rolesRepository.findMany({
        orderBy: { id: 'asc' },
        select: {
          id: true,
          name: true,
          createdAt: true,
        },
      });

      return roles;
    } catch {
      throw new InternalServerErrorException('Failed to fetch roles');
    }
  }

  // Check if a role exists
  async roleExists(name: string): Promise<boolean> {
    const role = await this.rolesRepository.findOne({
      where: { name: name.toLowerCase() },
    });
    return !!role;
  }

  // Validate role name
  private validateRoleName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Role name cannot be empty');
    }

    if (name.length > 50) {
      throw new BadRequestException('Role name cannot exceed 50 characters');
    }

    // Allow only alphanumeric characters and underscores
    const validNameRegex = /^[a-zA-Z0-9_]+$/;
    if (!validNameRegex.test(name)) {
      throw new BadRequestException(
        'Role name can only contain letters, numbers, and underscores',
      );
    }
  }

  // Handle Prisma errors
  private handlePrismaError(error: any): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          throw new ConflictException('Unique constraint violation');
        case 'P2025':
          throw new NotFoundException('Record not found');
        default:
          throw new InternalServerErrorException(
            `Database error: ${error.message}`,
          );
      }
    }
    throw new InternalServerErrorException('An unexpected error occurred');
  }
}
