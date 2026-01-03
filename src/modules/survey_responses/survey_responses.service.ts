import { Injectable } from '@nestjs/common';
import { CreateSurveyResponseDto } from './dto/create-survey_response.dto';
import { UpdateSurveyResponseDto } from './dto/update-survey_response.dto';

@Injectable()
export class SurveyResponsesService {
  create(createSurveyResponseDto: CreateSurveyResponseDto) {
    return 'This action adds a new surveyResponse';
  }

  findAll() {
    return `This action returns all surveyResponses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} surveyResponse`;
  }

  update(id: number, updateSurveyResponseDto: UpdateSurveyResponseDto) {
    return `This action updates a #${id} surveyResponse`;
  }

  remove(id: number) {
    return `This action removes a #${id} surveyResponse`;
  }
}
