import { forwardRef, Module } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { ClassroomsRepository } from './repositories/classrooms.repository';
import { UsersModule } from 'src/users/users.module';
import { EnrollmentsModule } from 'src/enrollments/enrollments.module';

@Module({
  imports: [UsersModule, forwardRef(() => EnrollmentsModule)],
  controllers: [ClassroomsController],
  providers: [ClassroomsService, ClassroomsRepository],
  exports: [ClassroomsService, ClassroomsRepository],
})
export class ClassroomsModule {}
