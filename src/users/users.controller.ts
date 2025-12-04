import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from '../common/guards';
import { Roles } from '../common/decorators';
import { CreateUserDto, UpdateUserDto, QueryUsersDto } from './dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles('admin', 'teacher')
  findAll(@Query() query: QueryUsersDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @Roles('admin', 'teacher')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Patch(':id/lock')
  @Roles('admin')
  lockUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.lockUser(id);
  }

  @Patch(':id/unlock')
  @Roles('admin')
  unlockUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.unlockUser(id);
  }

  // @Get(':id/enrollments')
  // @Roles('admin', 'teacher', 'student')
  // getUserEnrollments(@Param('id', ParseIntPipe) id: number) {
  //   return this.usersService.getUserEnrollments(id);
  // }
}
