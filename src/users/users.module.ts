import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './repositories/users.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [PrismaModule, RolesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
