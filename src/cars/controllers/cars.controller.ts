import { Manufacturer } from './../entities/manufacturer.entity';
import { TransformInterceptor } from './../../generic/interceptors/transform.interceptor';
import { ManufacturerDto } from './../dto/manufacturer.dto';
import { Controller, Get, UseInterceptors, Param } from '@nestjs/common';
import { CarsService } from './../services/cars.service';

@Controller('cars')
export class CarsController {

  constructor(private carsService: CarsService) {}

  @Get(':id/manufacturer')
  @UseInterceptors(new TransformInterceptor(ManufacturerDto))
  public async getManufacturerInfo(@Param('id') carId: number): Promise<Manufacturer> {
    return this.carsService.getCarManufacturer(carId);
  }
}