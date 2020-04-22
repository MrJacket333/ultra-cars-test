import { CarsRepository } from './../../../../src/cars/repositories/cars.repository';
import { CarsService } from './../../../../src/cars/services/cars.service';
import { Manufacturer } from './../../../../src/cars/entities/manufacturer.entity';
import { Car } from './../../../../src/cars/entities/car.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as faker from 'faker';

describe('Unit: Cars service', () => {
  let service: CarsService;
  let mockRepo: any;
  let discountsCount;

  let manufacturer;
  beforeAll(async () => {
    manufacturer = new Manufacturer();
    manufacturer.id = faker.random.number();
    manufacturer.name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    manufacturer.phone = faker.phone.phoneNumber();
    manufacturer.siret = faker.random.number();

    discountsCount = faker.random.number(10);

    const car = new Car();
    car.id = 1;
    car.manufacturer = manufacturer;

    mockRepo = {
      findOne: jest.fn().mockImplementation(async carId => {
        return carId === car.id ? car : null;
      }),
      applyDiscount: jest.fn().mockResolvedValue(discountsCount)
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(CarsRepository),
          useValue: mockRepo,
        },
        CarsService,
      ],
    }).compile();
    service = module.get<CarsService>(CarsService);
  });

  afterEach(() => {
    mockRepo.findOne.mockClear();
  });

  describe('when service is created', () => {
    it('then service instance should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('when call "getCarManufacturer" method', () => {    
    describe('when manufacturer info exists for the specified car', () => {
      it('should return manufacturer info when car id is specified', async () => {
        const testManufacturer = await service.getCarManufacturer(1);
        expect(mockRepo.findOne).toHaveBeenCalled();
        expect(testManufacturer).toBeDefined();
        expect(testManufacturer).toEqual(manufacturer);
      });
    });

    describe('when manufacturer info does not exist for the specified car', () => {
      beforeAll(() => {
        manufacturer = null;
      });

      it('should throw an exception when manufacturer info is not found', async () => {
        try {
          await service.getCarManufacturer(2);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.status).toEqual(404);
          expect(e.message).toEqual('Car not found');
        }
        expect(mockRepo.findOne).toHaveBeenCalled();
      });

      it('should throw an expection when car id is not specified', async () => {
        try {
          await service.getCarManufacturer(null);
        } catch (e) {
          expect(e).toBeDefined();
          expect(e.status).toEqual(422);
          expect(e.message).toEqual('Car ID is not cpecified');
        }
      })
    });
  });

  describe('when call "applyDiscount" method', () => {
    let minDate;
    let maxDate;

    beforeAll(() => {
      minDate = faker.date.past(),
      maxDate = faker.date.past()
    });

    it('should call "applyDiscount" repository method', async () => {
      const count = await service.applyDiscount(minDate, maxDate);
      expect(mockRepo.applyDiscount).toHaveBeenCalledWith(minDate, maxDate);
      expect(count).toEqual(discountsCount);
    });
  });
});
