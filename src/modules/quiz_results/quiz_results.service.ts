import { Injectable } from '@nestjs/common';
import { CreateQuizResultDto } from './dto/create-quiz_result.dto';
import { UpdateQuizResultDto } from './dto/update-quiz_result.dto';

@Injectable()
export class QuizResultsService {
  create(createQuizResultDto: CreateQuizResultDto) {
    return 'This action adds a new quizResult';
  }

  findAll() {
    return `This action returns all quizResults`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quizResult`;
  }

  update(id: number, updateQuizResultDto: UpdateQuizResultDto) {
    return `This action updates a #${id} quizResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} quizResult`;
  }
}
