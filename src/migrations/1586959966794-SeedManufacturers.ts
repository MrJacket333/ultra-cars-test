import { MigrationInterface, QueryRunner } from "typeorm";
import * as faker from "faker";

export class SeedManufacturers1586959966794 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const queryParts = [];
    const manufacturersCount = faker.random.number({ min: 5, max: 10 });
    for (let i = 0; i < manufacturersCount; i++) {
      const manufacturer = {
        name: `${faker.name.firstName()} ${faker.name.lastName()}`.replace(/'/g, "."),
        phone: faker.phone.phoneNumber(),
        siret: faker.random.number(),
      };
      queryParts.push(`('${manufacturer.name}','${manufacturer.phone}', ${manufacturer.siret})`);
    }
    const seedQuery = `INSERT INTO manufacturer ("name", "phone", "siret") values ${queryParts.join(", ")};`;
    return queryRunner.query(seedQuery);
  }

  public async down(): Promise<any> {
    throw new Error("Can't revert database seed");
  }
}
