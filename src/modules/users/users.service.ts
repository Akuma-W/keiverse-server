import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto, QueryUsersDto, UpdateUserDto } from './dto';
import { UsersRepository } from './repositories/users.repository';

// Service for managing User entities
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly configService: ConfigService,
  ) {}

  // Create a new user
  async create(dto: CreateUserDto) {
    const { username, email, roleId, password } = dto;

    // Check if username already exists
    const existedUsername = await this.usersRepo.findByUnique({ username });
    if (existedUsername) {
      throw new BadRequestException('Username already exists');
    }
    // Check if email already exists
    const existedEmail = await this.usersRepo.findByUnique({ email });
    if (existedEmail) {
      throw new BadRequestException('Email already exists');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      this.configService.get<number>('auth.bcrypt.saltRounds', 10),
    );

    this.logger.log(`Creating user with username: ${username}`);
    return this.usersRepo.create({
      ...dto,
      password: hashedPassword,
      role: { connect: { id: roleId } },
    });
  }

  // Get all users with pagination and filtering
  async findAll(query: QueryUsersDto) {
    const { page = 1, limit = 10, keyword, roleId, isLocked } = query;

    const skip = (page - 1) * limit;
    const where = {
      OR: [] as any[],
      roleId: 0,
      isLocked: false,
    };

    if (keyword) {
      where.OR = [
        { username: { contains: keyword, mode: 'insensitive' } },
        { fullName: { contains: keyword, mode: 'insensitive' } },
        { email: { contains: keyword, mode: 'insensitive' } },
        { phone: { contains: keyword, mode: 'insensitive' } },
        { school: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    if (roleId) where.roleId = roleId;
    if (isLocked !== undefined) where.isLocked = isLocked;

    this.logger.log(`Fetching users - Page: ${page}, Limit: ${limit}`);
    return this.usersRepo.findMany(where, skip, limit);
  }

  // Get a single user by ID
  async findOne(id: number) {
    const user = await this.usersRepo.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.log(`Fetching user with ID: ${id}`);
    return user;
  }

  // Update a user
  async update(id: number, dto: UpdateUserDto) {
    await this.findOne(id); // Ensure user exists
    this.logger.log(`Updating user with ID: ${id}`);
    return this.usersRepo.update(id, dto);
  }

  // Delete a user
  async remove(id: number) {
    await this.findOne(id); // Ensure user exists
    this.logger.log(`Deleting user with ID: ${id}`);
    return this.usersRepo.delete(id);
  }
}
