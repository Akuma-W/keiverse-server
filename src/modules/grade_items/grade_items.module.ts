import { Module } from '@nestjs/common';
import { GradeItemsService } from './grade_items.service';
import { GradeItemsController } from './grade_items.controller';

@Module({
  controllers: [GradeItemsController],
  providers: [GradeItemsService],
})
export class GradeItemsModule {}
