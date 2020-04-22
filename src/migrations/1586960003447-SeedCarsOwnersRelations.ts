import {MigrationInterface, QueryRunner} from "typeorm";
import * as faker from "faker";

export class SeedCarsOwnersRelations1586960003447 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const carIds = await queryRunner.query(`SELECT id FROM car`);
        const ownerIds = await queryRunner.query(`SELECT id FROM owner`);
        const queryParts = [];
        for (let i = 0; i < carIds.length; i++) {
            for (let j = 0; j < ownerIds.length; j++) {
                // Skip another 
                if (!faker.random.boolean() || i === j) {
                    continue;
                }
                const relation = {
                    carId: carIds[i].id,
                    ownerId: ownerIds[j].id
                };
                queryParts.push(`(${relation.carId}, ${relation.ownerId})`);
            }
        }
        const query = `INSERT INTO car_owners ("carId", "ownerId")
            values ${queryParts.join(', ')};`;
        return queryRunner.query(query);
    }

    public async down(): Promise<any> {
        throw new Error("Can't revert database seed");
    }
}
