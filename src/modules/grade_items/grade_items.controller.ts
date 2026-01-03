import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GradeItemsService } from './grade_items.service';
import { CreateGradeItemDto } from './dto/create-grade_item.dto';
import { UpdateGradeItemDto } from './dto/update-grade_item.dto';

@Controller('grade-items')
export class GradeItemsController {
  constructor(private readonly gradeItemsService: GradeItemsService) {}

  @Post()
  create(@Body() createGradeItemDto: CreateGradeItemDto) {
    return this.gradeItemsService.create(createGradeItemDto);
  }

  @Get()
  findAll() {
    return this.gradeItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradeItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGradeItemDto: UpdateGradeItemDto) {
    return this.gradeItemsService.update(+id, updateGradeItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradeItemsService.remove(+id);
  }
}
