import { Module } from '@nestjs/common';
import { SurveyResponsesService } from './survey_responses.service';
import { SurveyResponsesController } from './survey_responses.controller';

@Module({
  controllers: [SurveyResponsesController],
  providers: [SurveyResponsesService],
})
export class SurveyResponsesModule {}
