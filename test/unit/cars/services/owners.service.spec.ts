import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import * as faker from 'faker';

import { OwnersRepository } from './../../../../src/cars/repositories/owners.repository';
import { OwnersService } from './../../../../src/cars/services/owners.service';

describe('Unit: Owners service', () => {
  let service: OwnersService;
  let mockRepo: any;
  let ownersCountToRemove;

  beforeAll(async () => {
    ownersCountToRemove = faker.random.number({ max: 10 });
    mockRepo = {
      deleteBatchBeforePurchaseDate: jest.fn().mockResolvedValue(ownersCountToRemove)
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(OwnersRepository),
          useValue: mockRepo,
        },
        OwnersService,
      ],
    }).compile();
    service = module.get<OwnersService>(OwnersService);
  });

  afterEach(() => {
    mockRepo.deleteBatchBeforePurchaseDate.mockClear();
  });

  describe('when service is created', () => {
    it('then service instance should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('when call "batchRemoveBeforePurchaseDate" method', () => {
    let purchaseDate;

    beforeAll(() => {
      purchaseDate = faker.date.past();
    });

    it('should return result of "deleteBatchBeforePurchaseDate" repository method', async () => {
      const result = await service.batchRemoveBeforePurchaseDate(purchaseDate);
      expect(mockRepo.deleteBatchBeforePurchaseDate).toHaveBeenCalledWith(purchaseDate);
      expect(result).toEqual(ownersCountToRemove);
    });
  });
});
