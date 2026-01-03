import { Injectable } from '@nestjs/common';
import { CreateGradeStructureDto } from './dto/create-grade_structure.dto';
import { UpdateGradeStructureDto } from './dto/update-grade_structure.dto';

@Injectable()
export class GradeStructuresService {
  create(createGradeStructureDto: CreateGradeStructureDto) {
    return 'This action adds a new gradeStructure';
  }

  findAll() {
    return `This action returns all gradeStructures`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gradeStructure`;
  }

  update(id: number, updateGradeStructureDto: UpdateGradeStructureDto) {
    return `This action updates a #${id} gradeStructure`;
  }

  remove(id: number) {
    return `This action removes a #${id} gradeStructure`;
  }
}
