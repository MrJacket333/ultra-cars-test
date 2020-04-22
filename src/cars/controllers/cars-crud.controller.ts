import { CarsCRUDService } from '../crud/cars-crud.service';
import { Controller } from '@nestjs/common';
import { Crud } from '@nestjsx/crud';

import { Car } from '../entities/car.entity';

@Crud({
  model: {
    type: Car
  },
  query: {
    join: {
      owners: {
        eager: true
      }
    }
  },
})
@Controller('cars')
export class CarsCRUDController {

  constructor(private service: CarsCRUDService) {}
}
