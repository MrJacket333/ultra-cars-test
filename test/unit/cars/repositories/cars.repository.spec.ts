import { Car } from './../../../../src/cars/entities/car.entity';
import { CarsRepository } from './../../../../src/cars/repositories/cars.repository';
import * as mock from "universal-mock";
import { SelectQueryBuilder } from 'typeorm';
import * as faker from 'faker';

describe('Unit: CarsRepository', () => { 

  let repository: CarsRepository;
  let queryBuilderSpy: jest.SpyInstance;
  let queryBuilder: SelectQueryBuilder<Car>;
  let saveSpy: jest.SpyInstance;
  let entities: Car[];

  function getModelInstance(index?:number) {
    const car = new Car();
    car.id = index || faker.random.number({min: 1, max: 10});
    car.firstRegistrationDate = new Date();
    car.price = faker.random.number({min: 1000, max: 10000});
    car.manufacturerId = faker.random.number(10);
    car.discount = false;
    return car;
  }

  beforeAll(() => {
    repository = new CarsRepository();
  });

  beforeAll(() => {
    queryBuilder = mock();
    const entitiesCount = faker.random.number({min: 1, max: 5});
    entities = [];
    for (let i = 0; i < entitiesCount; i++) {
      entities.push(getModelInstance(i + 1));
    }
    jest.spyOn(queryBuilder, 'getMany').mockReturnValue(Promise.resolve(entities));
    jest.spyOn(queryBuilder, 'select').mockReturnThis();
    jest.spyOn(queryBuilder, 'from').mockReturnThis();
    jest.spyOn(queryBuilder, 'where').mockReturnThis();
    jest.spyOn(queryBuilder, 'andWhere').mockReturnThis();    
    queryBuilderSpy = jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder);
    saveSpy = jest.spyOn(repository, 'save').mockImplementation((car: Car) => Promise.resolve(car));
  });

  afterEach(() => {
    queryBuilderSpy.mockClear();
    saveSpy.mockClear();
    
  });

  afterAll(() => {
    queryBuilderSpy.mockRestore();
    saveSpy.mockRestore();
  });

  describe('when we call constructor method', () => {
    it('then repository instance should be created', () => {
      expect(repository).toBeDefined();
    });
  });

  describe('when call "applyDiscount" method', () => {    
    let minDate;
    let maxDate;
    let updatedCount;
    let priceValues;

    beforeAll(async () => {
      minDate = faker.date.past();
      maxDate = faker.date.past();
      priceValues = entities.map(entity => ({id: entity.id, price: entity.price}));
      updatedCount = await repository.applyDiscount(minDate, maxDate);
    });

    it('should update entities that matches criteria', () => {
      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(queryBuilder.select).toHaveBeenCalledWith('car');
      expect(queryBuilder.from).toHaveBeenCalledWith(Car, 'car');
      expect(queryBuilder.where).toHaveBeenCalledWith('car.discount = false');
      expect(queryBuilder.andWhere).toHaveBeenCalled();
      const whereSpy: jest.SpyInstance = (queryBuilder.andWhere as unknown) as jest.SpyInstance;
      expect(whereSpy.mock.calls.length).toEqual(2);
      expect(whereSpy).nthCalledWith(1, 'car.firstRegistrationDate < :maxDate', { maxDate });
      expect(whereSpy).nthCalledWith(2, 'car.firstRegistrationDate > :minDate', { minDate });
      expect(saveSpy).toHaveBeenCalled();
      expect(saveSpy.mock.calls.length).toEqual(entities.length);
    });

    it('then return result should be equal to the count of updated entities', () => {
      expect(updatedCount).toEqual(entities.length);
      entities.forEach(entity => {
        const priceValue = priceValues.find(priceVal => priceVal.id === entity.id);
        expect(entity.discount).toBeTruthy();
        const updatedPrice = Math.ceil(priceValue.price * 4 / 5);
        expect(entity.price).toEqual(updatedPrice);
      });
    });    
  });
});