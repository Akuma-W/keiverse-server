import { Module } from '@nestjs/common';
import { QuizQuestionsService } from './quiz_questions.service';
import { QuizQuestionsController } from './quiz_questions.controller';

@Module({
  controllers: [QuizQuestionsController],
  providers: [QuizQuestionsService],
})
export class QuizQuestionsModule {}
