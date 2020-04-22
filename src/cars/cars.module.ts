import { QueueProcessor } from './processors/queue-processor';
import { ProcessController } from './controllers/process.controller';
import { QueueService } from './services/queue.service';


import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, Logger } from '@nestjs/common';
import { CarsCRUDController } from './controllers/cars-crud.controller';
import { CarsController } from './controllers/cars.controller';
import { CarsCRUDService } from './crud/cars-crud.service';
import { CarsService } from './services/cars.service';
import { OwnersService } from './services/owners.service';
import { CarsRepository } from './repositories/cars.repository';
import { ManufacturerRepository } from './repositories/manufacturers.repository';
import { OwnersRepository } from './repositories/owners.repository';

import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CarsRepository, ManufacturerRepository, OwnersRepository
    ]),
    BullModule.registerQueue({
      name: 'cars-bg',
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },      
    }),
    Logger
  ],
  controllers: [CarsCRUDController, CarsController, ProcessController],
  providers: [CarsCRUDService, CarsService, OwnersService, QueueService, QueueProcessor]
})
export class CarsModule {}
