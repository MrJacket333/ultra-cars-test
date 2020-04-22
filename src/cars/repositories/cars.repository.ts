import { Repository, EntityRepository } from 'typeorm';

import { Car } from '../entities/car.entity';

@EntityRepository(Car)
export class CarsRepository extends Repository<Car> {

  /**
   * Apply discount to all cars with registration date in set date period
   * @param {Date} minDate Minimum date value
   * @param {Date} maxDate Maximum date value
   * @returns {Promise<number>} Updated cars count
   */
  public async applyDiscount(minDate: Date, maxDate: Date): Promise<number> {
    let cars = [];
    cars = await this.createQueryBuilder()
      .select('car')
      .from(Car, 'car')
      .where('car.discount = false')
      .andWhere('car.firstRegistrationDate < :maxDate', { maxDate })
      .andWhere('car.firstRegistrationDate > :minDate', { minDate })
      .getMany();

    let updatedCarsCount = 0;

    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];
      car.discount = true;
      try {
        car.price = Math.ceil(car.price * 4 / 5);
        await this.save(car);
        updatedCarsCount += 1;
      } catch (e) {
        console.error('Unexpected error:', e);
        continue;
      }
    }
    return updatedCarsCount;
  }
}
