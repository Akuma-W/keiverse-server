import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizSessionDto } from './create-quiz_session.dto';

export class UpdateQuizSessionDto extends PartialType(CreateQuizSessionDto) {}
