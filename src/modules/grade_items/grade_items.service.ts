import { Injectable } from '@nestjs/common';
import { CreateGradeItemDto } from './dto/create-grade_item.dto';
import { UpdateGradeItemDto } from './dto/update-grade_item.dto';

@Injectable()
export class GradeItemsService {
  create(createGradeItemDto: CreateGradeItemDto) {
    return 'This action adds a new gradeItem';
  }

  findAll() {
    return `This action returns all gradeItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gradeItem`;
  }

  update(id: number, updateGradeItemDto: UpdateGradeItemDto) {
    return `This action updates a #${id} gradeItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} gradeItem`;
  }
}
