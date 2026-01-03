import { forwardRef, Module } from '@nestjs/common';

import { EnrollmentsModule } from '@/modules/enrollments/enrollments.module';
import { UsersModule } from '@/modules/users/users.module';

import { ClassroomsController } from './classrooms.controller';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsRepository } from './repositories/classrooms.repository';

@Module({
  imports: [UsersModule, forwardRef(() => EnrollmentsModule)],
  controllers: [ClassroomsController],
  providers: [ClassroomsService, ClassroomsRepository],
  exports: [ClassroomsService, ClassroomsRepository],
})
export class ClassroomsModule {}
