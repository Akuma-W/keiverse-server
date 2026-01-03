import { PartialType } from '@nestjs/mapped-types';
import { CreateSurveyResponseDto } from './create-survey_response.dto';

export class UpdateSurveyResponseDto extends PartialType(CreateSurveyResponseDto) {}
