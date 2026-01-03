import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GradeStructuresService } from './grade_structures.service';
import { CreateGradeStructureDto } from './dto/create-grade_structure.dto';
import { UpdateGradeStructureDto } from './dto/update-grade_structure.dto';

@Controller('grade-structures')
export class GradeStructuresController {
  constructor(private readonly gradeStructuresService: GradeStructuresService) {}

  @Post()
  create(@Body() createGradeStructureDto: CreateGradeStructureDto) {
    return this.gradeStructuresService.create(createGradeStructureDto);
  }

  @Get()
  findAll() {
    return this.gradeStructuresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradeStructuresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGradeStructureDto: UpdateGradeStructureDto) {
    return this.gradeStructuresService.update(+id, updateGradeStructureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradeStructuresService.remove(+id);
  }
}
