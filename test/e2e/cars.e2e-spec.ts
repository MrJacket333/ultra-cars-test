import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import * as faker from 'faker';

import { Owner } from '../../src/cars/entities/owner.entity';
import { Car } from '../../src/cars/entities/car.entity';
import { AppModule } from '../../src/app.module';
import { Manufacturer } from '../../src/cars/entities/manufacturer.entity';
import { DataInitializer } from './utils/init-test-data';


function compareOutputToEntity(carOutput: any, car: Car) {  
  expect(carOutput.firstRegistrationDate).toEqual(car.firstRegistrationDate.toISOString());
  expect(carOutput.price).toEqual(car.price);
  expect(carOutput.discount).toEqual(car.discount);
  expect(carOutput.owners).toBeDefined();
  expect(carOutput.owners.length).toEqual(car.owners.length);
  carOutput.owners.forEach((owner: any) => {
    const carOwner = car.owners.find((entityOwner => entityOwner.id === owner.id));
    expect(carOwner).toBeDefined();
    expect(owner.name).toEqual(carOwner.name);
    expect(owner.purchaseDate).toEqual(carOwner.purchaseDate.toISOString())
  });
}

describe('CarsController (e2e)', () => {
  let app: INestApplication;
  let dataInitializer: DataInitializer;
  let carsRepo: Repository<Car>;
  let ownersRepo: Repository<Owner>;
  let manufacturersRepo: Repository<Manufacturer>;
  let moduleFixture: TestingModule;

  let cars: Car[];
  let manufacturer: Manufacturer;
  let randomCar: Car;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST || "localhost",
          port: parseInt(process.env.POSTGRES_APP_PORT) || 5432,
          username: process.env.POSTGRES_USER || "root",
          password: process.env.POSTGRES_PASSWORD || "postgres",
          database: 'UltraCarsE2ETest',
          entities: ['./**/*.entity.ts']
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async () => {
    ownersRepo = moduleFixture.get('OwnersRepository');
    carsRepo = moduleFixture.get('CarsRepository');
    manufacturersRepo = moduleFixture.get('ManufacturerRepository');

    dataInitializer = new DataInitializer(carsRepo, ownersRepo, manufacturersRepo);

    const values = await dataInitializer.initData();
    cars = values[0] as Car[];
    manufacturer = values[2] as Manufacturer;
  });

  beforeAll(() => {
    const carIndex = faker.random.number({min: 0, max: 3});
    randomCar = cars[carIndex];
  });

  afterAll(async () => {
    await dataInitializer.clearData();
    app.close();
  });

  it('/cars (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/cars?filter=id||$in||${cars.map(car => car.id).join(',')}`)
      .expect(200);
    body.forEach(element => {
      const car = cars.find(carEntity => carEntity.id === element.id);
      expect(car).toBeDefined();
      compareOutputToEntity(element, car);
    });
  });

  it('/cars/:id (GET)', async () => {
    const { body } = await request(app.getHttpServer())
      .get(`/cars/${randomCar.id}`)
      .expect(200);
    compareOutputToEntity(body, randomCar);
  });

  it('/cars/:id/manufacturer (GET)', () => {
    return request(app.getHttpServer())
      .get(`/cars/${randomCar.id}/manufacturer`)
      .expect(200)
      .expect({
        id: randomCar.manufacturer.id,
        name: randomCar.manufacturer.name,
        phone: randomCar.manufacturer.phone,
        siret: randomCar.manufacturer.siret
      });
  });

  describe('test state update operations', () => {

    afterAll(async () => {
      cars = await dataInitializer.refreshCarsModelsData();
    });

    it('/cars/:id (PATCH)', async () => {     
      const { body } = await request(app.getHttpServer())
        .patch(`/cars/${randomCar.id}`)
        .send({price: randomCar.price + 100 })
        .expect(200);
      expect(body.id).toEqual(randomCar.id);
      expect(body.price).toEqual(randomCar.price + 100);
    });

    it('/cars/:id (PUT)', async () => {
      const currentDate = new Date();
      const { body } = await request(app.getHttpServer())
        .put(`/cars/${randomCar.id}`)
        .send({
          price: randomCar.price + 100,
          firstRegistrationDate: currentDate.toISOString()
        })
        .expect(200);
      expect(body.id).toEqual(randomCar.id);
      expect(body.price).toEqual(randomCar.price + 100);
      expect(body.firstRegistrationDate).toEqual(currentDate.toISOString());
    });

    it('/cars/:id (DELETE)', async () => {
      await request(app.getHttpServer())
        .delete(`/cars/${randomCar.id}`)
        .expect(200);
      await request(app.getHttpServer())
        .get(`/cars/${randomCar.id}`)
        .expect(404);
    });

    it('/cars (POST)', () => {
      return request(app.getHttpServer())
        .post('/cars')
        .send({
          price: 10000,
          firstRegistrationDate: new Date().toISOString(),
          manufacturerId: manufacturer.id
        }).expect(201)
    });
  });  
});
