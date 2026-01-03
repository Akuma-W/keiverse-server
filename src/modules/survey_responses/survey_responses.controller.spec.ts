import { Test, TestingModule } from '@nestjs/testing';
import { SurveyResponsesController } from './survey_responses.controller';
import { SurveyResponsesService } from './survey_responses.service';

describe('SurveyResponsesController', () => {
  let controller: SurveyResponsesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyResponsesController],
      providers: [SurveyResponsesService],
    }).compile();

    controller = module.get<SurveyResponsesController>(SurveyResponsesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
