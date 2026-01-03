import { Test, TestingModule } from '@nestjs/testing';
import { GradeStructuresService } from './grade_structures.service';

describe('GradeStructuresService', () => {
  let service: GradeStructuresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GradeStructuresService],
    }).compile();

    service = module.get<GradeStructuresService>(GradeStructuresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
