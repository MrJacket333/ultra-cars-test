import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import * as request from 'supertest';

import { DataInitializer } from './utils/init-test-data';
import { Owner } from '../../src/cars/entities/owner.entity';
import { Car } from '../../src/cars/entities/car.entity';
import { AppModule } from '../../src/app.module';
import { Manufacturer } from '../../src/cars/entities/manufacturer.entity';

describe('ProcessController (e2e)', () => {
  let app: INestApplication;
  let dataInitializer: DataInitializer;
  let carsRepo: Repository<Car>;
  let ownersRepo: Repository<Owner>;
  let manufacturersRepo: Repository<Manufacturer>;
  let moduleFixture: TestingModule;

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
    await dataInitializer.initData();
  });

  afterAll(async () => {
    await dataInitializer.clearData();
    app.close();
  })

  it('/process/discount (POST)', (done) => {
    request(app.getHttpServer())
      .post('/process/discount')
      .expect(200)
      .expect('Process triggered');
    setTimeout(done, 500);
  });  
});