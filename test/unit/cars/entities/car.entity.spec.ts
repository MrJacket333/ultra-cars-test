import { Owner } from '../../../../src/cars/entities/owner.entity';
import { Car } from '../../../../src/cars/entities/car.entity';
import { Manufacturer } from '../../../../src/cars/entities/manufacturer.entity';
import * as faker from 'faker';

describe('Unit: Car entity', () => {
  let car;

  let manufacturer: Manufacturer;
  let owners: Owner[];

  beforeAll(() => {
    manufacturer = new Manufacturer();
    manufacturer.name = `${faker.name.firstName()} ${faker.name.lastName()}`;
    manufacturer.phone = faker.phone.phoneNumber();
    manufacturer.siret = faker.random.number();

    const ownersCount = faker.random.number({ max: 5 });
    const owners = new Array<Owner>(ownersCount);
    for (let i = 0; i < ownersCount; i++) {
      const owner = new Owner();
      owner.name = `${faker.name.firstName()} ${faker.name.lastName()}`;
      owner.purchaseDate = faker.date.past();
      owners.push(owner);
    }
  });

  beforeEach(() => {
    car = new Car();
    car.firstRegistrationDate = faker.date.past();
    car.price = faker.random.number({ min: 10000, max: 100000 });
    car.manufacturer = manufacturer;
    car.owners = owners;
  });

  it('Should create a new entity', () => {
    expect(car).toBeDefined();
  });
});
