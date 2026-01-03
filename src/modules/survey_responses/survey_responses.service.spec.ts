import { Test, TestingModule } from '@nestjs/testing';
import { SurveyResponsesService } from './survey_responses.service';

describe('SurveyResponsesService', () => {
  let service: SurveyResponsesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SurveyResponsesService],
    }).compile();

    service = module.get<SurveyResponsesService>(SurveyResponsesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
