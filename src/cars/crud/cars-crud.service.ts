import { CarsRepository } from '../repositories/cars.repository';
import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Car } from '../entities/car.entity';

@Injectable()
export class CarsCRUDService extends TypeOrmCrudService<Car> {

  constructor(private carsRepo: CarsRepository) {
    super(carsRepo);
  }
  
}
