import { Module } from '@nestjs/common';
import { GradeStructuresService } from './grade_structures.service';
import { GradeStructuresController } from './grade_structures.controller';

@Module({
  controllers: [GradeStructuresController],
  providers: [GradeStructuresService],
})
export class GradeStructuresModule {}
