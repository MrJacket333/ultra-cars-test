import {MigrationInterface, QueryRunner} from "typeorm";
import * as faker from "faker";
import * as moment from "moment";

export class SeedCars1586959987105 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const manufacturerIds = await queryRunner.query('SELECT id FROM manufacturer');
        const carsCount = faker.random.number({min: 5, max: 10});
        const queryParts = [];
        for (let i = 0; i < carsCount; i++) {
            const minDate = moment().subtract(18, 'months').toDate();
            const maxDate = moment().subtract(12, 'months').toDate();
            const car = {
                price: faker.random.number({ min: 1000000, max: 10000000 }),
                firstRegistrationDate: faker.date.between(minDate, maxDate).toISOString(),
                manufacturerId: manufacturerIds[Math.floor(Math.random() * manufacturerIds.length)].id
            };
            queryParts.push(`(${car.price}, '${car.firstRegistrationDate}', ${car.manufacturerId})`);
        }
        const seedQuery = `INSERT INTO car ("price", "firstRegistrationDate", "manufacturerId")
         values ${queryParts.join(', ')};`;
        return queryRunner.query(seedQuery);
    }

    public async down(): Promise<any> {
        throw new Error("Can't revert database seed");
    }

}
