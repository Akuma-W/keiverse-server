import { PartialType } from '@nestjs/mapped-types';
import { CreateGradeItemDto } from './create-grade_item.dto';

export class UpdateGradeItemDto extends PartialType(CreateGradeItemDto) {}
