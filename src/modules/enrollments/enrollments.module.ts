import { forwardRef, Module } from '@nestjs/common';

import { ClassroomsModule } from '@/modules/classrooms/classrooms.module';

import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsRepository } from './repositories/enrollments.repository';

@Module({
  imports: [forwardRef(() => ClassroomsModule)],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, EnrollmentsRepository],
  exports: [EnrollmentsService, EnrollmentsRepository],
})
export class EnrollmentsModule {}
