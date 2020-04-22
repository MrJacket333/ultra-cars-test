import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bull';
import * as mock from 'universal-mock';
import * as faker from 'faker';

import { RemoveOwnersBatch } from './../../../../src/cars/interfaces/OwnersRemoveBatch';
import { CarsService } from './../../../../src/cars/services/cars.service';
import { OwnersService } from './../../../../src/cars/services/owners.service';
import { QueueProcessor } from './../../../../src/cars/processors/queue-processor';
import { CarsApplyDiscount } from './../../../../src/cars/interfaces/CarsApplyDiscount';

describe("Unit: Queue processor", () => {
  let processor: QueueProcessor;
  let mockOwnersService;
  let mockCarsService;
  
  beforeAll(async () => {
    mockCarsService = {
      applyDiscount: jest.fn().mockResolvedValue(1)
    };
    mockOwnersService = {
      batchRemoveBeforePurchaseDate: jest.fn().mockResolvedValue(1)
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: OwnersService,
          useValue: mockOwnersService,
        },
        {
          provide: CarsService,
          useValue: mockCarsService
        },
        QueueProcessor,
      ],
    }).compile();
    processor = module.get<QueueProcessor>(QueueProcessor);
  });

  describe('when processor is created', () => {
    
    it('then processor instance should be defined', () => {
      expect(processor).toBeDefined();
    });
  });

  describe('when job starts processing', () => {
    let job: Job<unknown>;
    let consoleSpy: jest.SpyInstance;

    beforeAll(() => {
      job = mock();
      consoleSpy = jest.spyOn(console, 'log');
    });

    beforeEach(() => {
      consoleSpy.mockClear();
    });

    afterAll(() => {
      consoleSpy.mockRestore();
    });

    it('should display console message', async () => {
      await processor.onActive(job);
      expect(consoleSpy).toHaveBeenCalledWith(
        `Processing job ${job.id} of type ${job.name} with input ${JSON.stringify(job.data)}...`
      );
    })
  });

  describe('when "batchRemoveOwners" job is created', () => {
    let removeOwnersJob: Job<RemoveOwnersBatch>;
    let consoleSpy: jest.SpyInstance;

    beforeAll(() => {
      removeOwnersJob = mock();
      consoleSpy = jest.spyOn(console, 'log');
    });

    beforeEach(() => {
      consoleSpy.mockClear();
    });

    afterAll(() => {
      consoleSpy.mockRestore();
    })

    it('should call service method when job is created', async () => {
      await processor.removeOwners(removeOwnersJob);
      expect(mockOwnersService.batchRemoveBeforePurchaseDate).toHaveBeenCalledWith(removeOwnersJob.data.maxPurchaseDate)
    });

    it('should log message to the console when job is finished', async () => {
      const removedOwners = faker.random.number({min: 1, max: 10});
      await processor.ownersRemoveCompleted(removeOwnersJob, removedOwners);
      expect(consoleSpy).toHaveBeenCalledWith(`Finished removing owners from database: ${removedOwners}`)
    });
  });

  describe('when "carsApplyDiscount" job is created', () => {
    let applyDiscountJob: Job<CarsApplyDiscount>;
    let consoleSpy: jest.SpyInstance;

    beforeAll(() => {
      applyDiscountJob = mock();
      consoleSpy = jest.spyOn(console, 'log');
    });

    beforeEach(() => {
      consoleSpy.mockClear();
    });

    afterAll(() => {
      consoleSpy.mockRestore();
    })

    it('should call service method when job is created', async () => {
      await processor.carsApplyDiscount(applyDiscountJob);
      expect(mockCarsService.applyDiscount)
        .toHaveBeenCalledWith(applyDiscountJob.data.minDate, applyDiscountJob.data.maxDate);
    });

    it('should log message to the console when job is finished', async () => {
      const updatedCarsCount = faker.random.number({min: 1, max: 10});
      await processor.discountApplyCompleted(applyDiscountJob, updatedCarsCount);
      expect(consoleSpy)
        .toHaveBeenCalledWith(`Finished applying discount to cars: ${updatedCarsCount}`);
    });
  });
});