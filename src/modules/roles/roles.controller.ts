import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/roles.enum';
import { RolesGuard } from '@/common/guards/roles.guard';

import { CreateRoleDto, UpdateRoleDto } from './dto';
import { RolesService } from './roles.service';

// Controller for managing roles in the system
@ApiTags('Roles')
@ApiBearerAuth('access-token')
@UseGuards(RolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Create a new role
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  // Get all roles
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  // Get a role by ID
  @Get(':id')
  @Roles()
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  // Update a role by ID
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoleDto) {
    return this.rolesService.update(id, dto);
  }

  // Delete a role by ID
  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
