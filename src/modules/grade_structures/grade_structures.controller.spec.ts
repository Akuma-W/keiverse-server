import { Test, TestingModule } from '@nestjs/testing';
import { GradeStructuresController } from './grade_structures.controller';
import { GradeStructuresService } from './grade_structures.service';

describe('GradeStructuresController', () => {
  let controller: GradeStructuresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradeStructuresController],
      providers: [GradeStructuresService],
    }).compile();

    controller = module.get<GradeStructuresController>(GradeStructuresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
