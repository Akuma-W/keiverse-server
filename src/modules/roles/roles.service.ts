import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { CreateRoleDto, UpdateRoleDto } from './dto';
import { RolesRepository } from './repositories/roles.repository';

// Service for managing roles in the system
@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(private readonly rolesRepo: RolesRepository) {}

  // Create a new role
  async create(dto: CreateRoleDto) {
    const existed = await this.rolesRepo.findByName(dto.name);
    if (existed) {
      throw new BadRequestException('Role name already exists');
    }

    this.logger.log(`Creating role with name: ${dto.name}`);
    return this.rolesRepo.create({ name: dto.name });
  }

  // Get all roles
  async findAll() {
    this.logger.log('Fetching all roles');
    return this.rolesRepo.findAll();
  }

  // Get a role by ID
  async findOne(id: number) {
    const role = await this.rolesRepo.findById(id);
    if (!role) {
      throw new BadRequestException(`Role with ID ${id} not found`);
    }
    this.logger.log(`Fetched role with ID: ${id}`);
    return role;
  }

  // Update a role
  async update(id: number, dto: UpdateRoleDto) {
    await this.findOne(id);

    if (dto.name) {
      const existed = await this.rolesRepo.findByName(dto.name);
      if (existed && existed.id !== id) {
        throw new BadRequestException('Role name already exists');
      }
    }

    this.logger.log(`Updating role with ID: ${id}`);
    return this.rolesRepo.update(id, dto);
  }

  // Delete a role
  async remove(id: number) {
    await this.findOne(id);

    const userCount = await this.rolesRepo.countUsers(id);
    if (userCount > 0) {
      throw new BadRequestException('Cannot delete role assigned to users');
    }

    this.logger.log(`Deleting role with ID: ${id}`);
    return this.rolesRepo.delete(id);
  }
}
