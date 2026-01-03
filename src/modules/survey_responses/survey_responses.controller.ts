import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SurveyResponsesService } from './survey_responses.service';
import { CreateSurveyResponseDto } from './dto/create-survey_response.dto';
import { UpdateSurveyResponseDto } from './dto/update-survey_response.dto';

@Controller('survey-responses')
export class SurveyResponsesController {
  constructor(private readonly surveyResponsesService: SurveyResponsesService) {}

  @Post()
  create(@Body() createSurveyResponseDto: CreateSurveyResponseDto) {
    return this.surveyResponsesService.create(createSurveyResponseDto);
  }

  @Get()
  findAll() {
    return this.surveyResponsesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surveyResponsesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSurveyResponseDto: UpdateSurveyResponseDto) {
    return this.surveyResponsesService.update(+id, updateSurveyResponseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.surveyResponsesService.remove(+id);
  }
}
