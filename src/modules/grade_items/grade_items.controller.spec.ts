import { Test, TestingModule } from '@nestjs/testing';
import { GradeItemsController } from './grade_items.controller';
import { GradeItemsService } from './grade_items.service';

describe('GradeItemsController', () => {
  let controller: GradeItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradeItemsController],
      providers: [GradeItemsService],
    }).compile();

    controller = module.get<GradeItemsController>(GradeItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
