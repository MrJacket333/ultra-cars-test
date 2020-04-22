import { CarsRepository } from './../repositories/cars.repository';
import { Manufacturer } from './../entities/manufacturer.entity';
import { HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

export class CarsService {

  constructor(
    @InjectRepository(CarsRepository) private readonly carsRepo: CarsRepository
    ) { }

  /**
   * Return info about cars' manufacturer 
   * @param {number} carId Car ID
   * @returns {Promise<Manufacturer>} Manufacturer info
   */
  public async getCarManufacturer(carId: number): Promise<Manufacturer> {
    if (!carId) {
      throw new HttpException('Car ID is not cpecified', 422);
    }
    const car = await this.carsRepo.findOne(carId, {
      relations: ['manufacturer'],
    });
    if (!car) {
      throw new HttpException('Car not found', 404);
    }
    return car.manufacturer;
  }

  /**
   * Applies discount to all cars for the given dates period
   * @param {Date} minDate Minimum period date
   * @param {Date} maxDate Maximum period date
   * @returns {Promise<number>} Count of updated cars records
   */
  public async applyDiscount(minDate: Date, maxDate: Date): Promise<number> {
    return this.carsRepo.applyDiscount(minDate, maxDate);
  }
}
