import { Module } from '@nestjs/common';
import { QuizSessionsService } from './quiz_sessions.service';
import { QuizSessionsController } from './quiz_sessions.controller';

@Module({
  controllers: [QuizSessionsController],
  providers: [QuizSessionsService],
})
export class QuizSessionsModule {}
