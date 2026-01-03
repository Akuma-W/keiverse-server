import { Test, TestingModule } from '@nestjs/testing';
import { QuizSessionsController } from './quiz_sessions.controller';
import { QuizSessionsService } from './quiz_sessions.service';

describe('QuizSessionsController', () => {
  let controller: QuizSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizSessionsController],
      providers: [QuizSessionsService],
    }).compile();

    controller = module.get<QuizSessionsController>(QuizSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
