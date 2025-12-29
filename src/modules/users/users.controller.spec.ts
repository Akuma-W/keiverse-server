import { Test, TestingModule } from '@nestjs/testing';

import { CreateUserDto, QueryUsersDto, UpdateUserDto } from './dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // CREATE USER
  describe('create', () => {
    it('should call UsersService.create with correct dto', async () => {
      const dto: CreateUserDto = {
        username: 'john',
        password: '123456',
        fullName: 'John Doe',
        email: 'john@gmail.com',
        school: 'ABC High School',
        roleId: 1,
      };

      const result = { id: 1, username: 'john' };
      mockUsersService.create.mockResolvedValue(result as any);

      const response = await controller.create(dto);

      expect(() => service.create(dto)).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  // FIND ALL USERS
  describe('findAll', () => {
    it('should call UsersService.findAll with query', async () => {
      const query: QueryUsersDto = {
        page: 1,
        limit: 10,
        keyword: 'john',
      };

      const result = {
        items: [],
        total: 0,
      };

      mockUsersService.findAll.mockResolvedValue(result as any);

      const response = await controller.findAll(query);

      expect(() => service.findAll(query)).toHaveBeenCalledWith(query);
      expect(response).toEqual(result);
    });
  });

  // FIND ONE USER
  describe('findOne', () => {
    it('should call UsersService.findOne with id', async () => {
      const userId = 1;
      const result = { id: userId, username: 'john' };

      mockUsersService.findOne.mockResolvedValue(result as any);

      const response = await controller.findOne(userId);

      expect(() => service.findOne(userId)).toHaveBeenCalledWith(userId);
      expect(response).toEqual(result);
    });
  });

  // UPDATE USER
  describe('update', () => {
    it('should call UsersService.update with id and dto', async () => {
      const userId = 1;
      const dto: UpdateUserDto = {
        fullName: 'John Updated',
        isLocked: true,
      };

      const result = { id: userId, ...dto };

      mockUsersService.update.mockResolvedValue(result);

      const response = await controller.update(userId, dto);

      expect(() => service.update(userId, dto)).toHaveBeenCalledWith(
        userId,
        dto,
      );
      expect(response).toEqual(result);
    });
  });

  // REMOVE USER
  describe('remove', () => {
    it('should call UsersService.remove with id', async () => {
      const userId = 1;
      const result = { id: userId };

      mockUsersService.remove.mockResolvedValue(result as any);

      const response = await controller.remove(userId);

      expect(() => service.remove(userId)).toHaveBeenCalledWith(userId);
      expect(response).toEqual(result);
    });
  });
});
