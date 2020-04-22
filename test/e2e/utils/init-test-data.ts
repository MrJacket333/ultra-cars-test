import { Repository } from 'typeorm';
import * as faker from 'faker';
import * as moment from 'moment';

import { Manufacturer } from './../../../src/cars/entities/manufacturer.entity';
import { Owner } from './../../../src/cars/entities/owner.entity';
import { Car } from './../../../src/cars/entities/car.entity';

export class DataInitializer {

  private cars: Car[];
  private owners: Owner[];
  private manufacturer: Manufacturer;

  constructor(
    private readonly carsRepo: Repository<Car>,
    private readonly ownersRepo: Repository<Owner>,
    private readonly manufacturersRepo: Repository<Manufacturer>
    ) {}

  public async initData(): Promise<[Car[], Owner[], Manufacturer]> {
    // await this.clearData();
    const [owners, manufacturer] = await Promise.all([
      this.initOwners(),
      this.initManufacturer()
    ]);
  this.owners = owners;
    this.manufacturer = manufacturer;
    const cars = await this.initCars();
    this.cars = cars;
    return [cars, owners, manufacturer];
  }

  public async clearData() {
    await this.carsRepo.delete(this.cars.map(car => car.id));
    await this.manufacturersRepo.delete(this.manufacturer.id);
    await this.ownersRepo.delete(this.owners.map(owner => owner.id))
    this.cars = null;
    this.owners = null;
    this.manufacturer = null;
  }

  public async initCars(): Promise<Car[]> {
    if (this.cars) {
      return this.cars;
    }
    this.cars = new Array<Car>(4);
    for (let i = 0; i < 4; i++) {
      const car = new Car();
      car.id = i + 1;
      let minDate: Date, maxDate: Date;
      if (i % 2 === 0) {
        minDate = moment().subtract(18, 'months').toDate();
        maxDate = moment().toDate();
      } else {
        maxDate = moment().subtract(18, 'months').toDate();
        minDate = moment().subtract(3, 'years').toDate();
      }
      car.price = faker.random.number({ min: 1000000, max: 10000000 }),
      car.firstRegistrationDate = faker.date.between(minDate, maxDate),
      car.manufacturer = this.manufacturer;
      car.owners = [this.owners[i]];
      car.discount = false;
      const insertedCar = await this.carsRepo.save(car);
      this.cars[i] = insertedCar;
    }
    return this.cars;
  }

  public async initOwners(): Promise<Owner[]> {
    if (this.owners) {
      return this.owners;
    }
    this.owners = new Array<Owner>(4);
    for (let i = 0; i < 4; i++) {
      const owner = new Owner();
      owner.id = i + 1;
      let minDate: Date, maxDate: Date;
      if (faker.random.boolean()) {
        minDate = moment().subtract(18, 'months').toDate();
        maxDate = moment().toDate();
      } else {
        maxDate = moment().subtract(18, 'months').toDate();
        minDate = moment().subtract(3, 'years').toDate();
      }
      owner.purchaseDate = faker.date.between(minDate, maxDate);
      owner.name = `${faker.name.firstName()} ${faker.name.lastName()}`.replace(/'/g,"");
      const insertedOwner = await this.ownersRepo.save(owner);
      this.owners[i] = insertedOwner;
    }
    return this.owners;
  }

  public async initManufacturer(): Promise<Manufacturer> {
    if (this.manufacturer) {
      return this.manufacturer;
    }
    const manufacturer = new Manufacturer();
    manufacturer.id = 1;
    manufacturer.name = `${faker.name.firstName()} ${faker.name.lastName()}`
      .replace(/'/g, '');
    manufacturer.phone = faker.phone.phoneNumber();
    manufacturer.siret = faker.random.number();
    this.manufacturer = await this.manufacturersRepo.save(manufacturer);
    return this.manufacturer;
  }

  public async refreshCarsModelsData() {
    this.cars = await this.carsRepo.find();
    return this.cars;
  }
}
