import { Manufacturer } from './../../../../src/cars/entities/manufacturer.entity';
import * as faker from 'faker';

describe('Unit: Manufacturer entity', () => {
  let manufacturer: Manufacturer;

  beforeEach(() => {
    manufacturer = new Manufacturer();
    manufacturer.id = faker.random.number();
    manufacturer.name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    manufacturer.phone = faker.phone.phoneNumber();
    manufacturer.siret = faker.random.number();
  });

  it('Should create a new entity', () => {
    expect(manufacturer).toBeDefined();
  });
});