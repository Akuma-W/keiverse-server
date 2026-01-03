import { Module } from '@nestjs/common';
import { QuizResultsService } from './quiz_results.service';
import { QuizResultsController } from './quiz_results.controller';

@Module({
  controllers: [QuizResultsController],
  providers: [QuizResultsService],
})
export class QuizResultsModule {}
