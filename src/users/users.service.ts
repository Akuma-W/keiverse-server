import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersRepository } from './repositories/users.repository';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto, UpdateUserDto, QueryUsersDto } from './dto';
import { Role } from 'src/roles/entities/role.entity';
import { UserUpdateInput, UserWhereUniqueInput } from 'generated/prisma/models';
import { User } from 'generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, email, role } = createUserDto;
    // Check if user already exists
    const existingUser = await this.findByUsernameOrEmail(username, email);

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Get or create role
    const roleName = role ?? 'student';
    const existingRole = await this.rolesService.findByName(roleName);

    let roleRecord: Role = existingRole;
    if (!existingRole) {
      roleRecord = await this.rolesService.create({ name: roleName });
    }

    // Create user
    console.log('UsersService: ', {
      ...createUserDto,
      role: {
        connect: { id: roleRecord.id },
      },
    });
    const user = await this.usersRepository.create({
      ...createUserDto,
      role: {
        connect: { id: roleRecord.id },
      },
    });

    return this.sanitizeUser(user);
  }

  async findAll(query: QueryUsersDto) {
    const { page = 1, limit = 10, role, search, ...filters } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { ...filters };

    if (role) {
      const roleRecord = (await this.rolesService.findByName(role)) as {
        id: number;
        createdAt: Date;
        name: string;
      };
      if (roleRecord) {
        where.roleId = roleRecord.id;
      }
    }

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.usersRepository.findMany({
        where,
        skip,
        take: limit,
        include: { role: true },
      }),
      this.usersRepository.count({ where }),
    ]);

    return {
      data: users.map((user) => this.sanitizeUser(user)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      include: { role: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.sanitizeUser(user);
  }

  async findByUsername(username: string) {
    return this.usersRepository.findOne({
      where: { username },
      include: { role: true },
    });
  }

  async findByEmail(email: string) {
    if (!email) return null;
    return this.usersRepository.findOne({
      where: { email },
      include: { role: true },
    });
  }

  async findByUsernameOrEmail(username: string, email?: string) {
    let where: UserWhereUniqueInput | undefined;

    if (username) {
      where = { username };
    } else if (email) {
      where = { email };
    } else {
      return null;
    }

    return this.usersRepository.findOne({
      where,
      include: { role: true },
    });
  }

  async findPasswordById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      include: { role: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user.password;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // Check if user exists
    const existingUser = (await this.findById(id)) as UpdateUserDto;
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if new username/email already exists
    const { username, email, role, password } = updateUserDto;
    if (username || email) {
      const duplicateUser = await this.usersRepository.findMany({
        where: {
          OR: [{ username }, { email }],
          NOT: { id },
        },
        take: 1,
      });

      if (duplicateUser.length > 0) {
        throw new ConflictException('Username or email already exists');
      }
    }

    // Update role if specified
    if (role) {
      const foundRole = await this.rolesService.findByName(role);
      updateUserDto.role = foundRole.name;
      delete updateUserDto.role;
    }

    // Hash password if provided
    if (password) {
      updateUserDto.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await this.usersRepository.update({
      where: { id },
      data: updateUserDto as UserUpdateInput,
      include: { role: true },
    });

    return this.sanitizeUser(updatedUser);
  }

  async remove(id: number) {
    // Check if user exists
    const existingUser = (await this.findById(id)) as UpdateUserDto;
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Soft delete (update isDeleted flag) or hard delete
    // For now, we'll do hard delete
    await this.usersRepository.delete({ where: { id } });

    return { message: 'User deleted successfully' };
  }

  async lockUser(id: number) {
    const user = (await this.findById(id)) as UpdateUserDto;
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.usersRepository.update({
      where: { id },
      data: { isLocked: true },
    });

    return this.sanitizeUser(updatedUser);
  }

  async unlockUser(id: number) {
    const user = (await this.findById(id)) as UpdateUserDto;
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const updatedUser = await this.usersRepository.update({
      where: { id },
      data: { isLocked: false },
    });

    return this.sanitizeUser(updatedUser);
  }

  // async getUserEnrollments(id: number) {
  //   const user = await this.usersRepository.findOne({
  //     where: { id },
  //     include: {
  //       enrollments: {
  //         include: {
  //           classroom: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!user) {
  //     throw new NotFoundException(`User with ID ${id} not found`);
  //   }

  //   return user.enrollments;
  // }

  sanitizeUser(user: User) {
    if (!user) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
