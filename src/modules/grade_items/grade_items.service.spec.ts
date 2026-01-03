import { Test, TestingModule } from '@nestjs/testing';
import { GradeItemsService } from './grade_items.service';

describe('GradeItemsService', () => {
  let service: GradeItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GradeItemsService],
    }).compile();

    service = module.get<GradeItemsService>(GradeItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
