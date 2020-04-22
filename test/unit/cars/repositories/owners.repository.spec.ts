import { Owner } from './../../../../src/cars/entities/owner.entity';
import { OwnersRepository } from './../../../../src/cars/repositories/owners.repository';
import * as mock from 'universal-mock';
import { SelectQueryBuilder } from 'typeorm';
import * as faker from 'faker';

describe('Unit: OwnersRepository', () => {

  let repository: OwnersRepository;
  let queryBuilderSpy: jest.SpyInstance;
  let queryBuilder: SelectQueryBuilder<Owner>;
  let deletedOwnersCount;

  beforeAll(() => {
    repository = new OwnersRepository();
    deletedOwnersCount = faker.random.number(10);
    queryBuilder = mock();
    jest.spyOn(queryBuilder, 'execute').mockReturnValue(Promise.resolve({ 
      affected: deletedOwnersCount 
    }));
    jest.spyOn(queryBuilder, 'delete').mockReturnThis();
    jest.spyOn(queryBuilder, 'from').mockReturnThis();
    jest.spyOn(queryBuilder, 'where').mockReturnThis();
    queryBuilderSpy = jest.spyOn(repository, 'createQueryBuilder').mockReturnValue(queryBuilder);
  });

  afterEach(() => {
    queryBuilderSpy.mockClear();
  });

  describe('when we call constructor method', () => {
    it('then repository instance should be created', () => {
      expect(repository).toBeDefined();
    });
  });

  describe('when call "deleteBatchBeforePurchaseDate" method', () => {
    let deletedCount;
    let maxPurchaseDate;

    beforeAll(async () => {
      maxPurchaseDate = faker.date.past();
      deletedCount = await repository.deleteBatchBeforePurchaseDate(maxPurchaseDate);      
    });

    it('should remove entities that match required parameters', () => {
      expect(deletedCount).toEqual(deletedOwnersCount);
      expect(queryBuilderSpy).toHaveBeenCalled();
      expect(queryBuilder.delete).toHaveBeenCalled();
      expect(queryBuilder.from).toHaveBeenCalledWith(Owner);
      expect(queryBuilder.where).toHaveBeenCalledWith('purchaseDate < :maxPurchaseDate', { maxPurchaseDate });
      expect(queryBuilder.execute).toHaveBeenCalled();
    })
  });
});