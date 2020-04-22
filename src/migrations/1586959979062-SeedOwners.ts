import {MigrationInterface, QueryRunner} from "typeorm";
import * as faker from "faker";
import * as moment from "moment";

export class SeedOwners1586959979062 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const queryParts = [];
        const ownersCount = faker.random.number({min: 5, max: 10});
        for (let i = 0; i < ownersCount; i++) {
            let minDate: Date, maxDate: Date;
            if (faker.random.boolean()) {
                minDate = moment().subtract(18, 'months').toDate();
                maxDate = moment().toDate();
            } else {
                maxDate = moment().subtract(18, 'months').toDate();
                minDate = moment().subtract(3, 'years').toDate();
            }
            const purchaseDate = faker.date.between(minDate, maxDate).toISOString();
            const owner = {
                name: `${faker.name.firstName()} ${faker.name.lastName()}`.replace(/'/g,""),
                purchaseDate
            };
            queryParts.push(`('${owner.name}', '${owner.purchaseDate}')`);
        }

        const seedQuery = `INSERT INTO "owner" ("name", "purchaseDate") values ${queryParts.join(', ')};`;

        return queryRunner.query(seedQuery);
    }

    public async down(): Promise<any> {
        throw new Error("Can't revert database seed");
    }

}
