import { Owner } from './../../../../src/cars/entities/owner.entity';
import * as faker from 'faker';

describe('Unit: Owner entity', () => {
  let owner: Owner;

  beforeEach(() => {
    owner = new Owner();
    owner.id = faker.random.number();
    owner.name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    owner.purchaseDate = faker.date.past();    
  });

  it('Should create a new entity', () => {
    expect(owner).toBeDefined();
  });
});