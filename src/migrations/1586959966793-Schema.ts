import { MigrationInterface, QueryRunner } from "typeorm";

const SCHEMA = `
DROP TABLE IF EXISTS "car_owners";
DROP TABLE IF EXISTS "car";
DROP TABLE IF EXISTS "manufacturer";
DROP TABLE IF EXISTS "owner";

CREATE TABLE "manufacturer" (
  "id" SERIAL NOT NULL, 
  "name" character varying NOT NULL, 
  "phone" character varying NOT NULL, 
  "siret" integer NOT NULL, 
  CONSTRAINT "PK_ManufacturerId" PRIMARY KEY ("id")
);

CREATE TABLE "owner" (
  "id" SERIAL NOT NULL, 
  "name" character varying NOT NULL, 
  "purchaseDate" TIMESTAMP NOT NULL, 
  CONSTRAINT "PK_OwnerId" PRIMARY KEY ("id")
);

CREATE TABLE "car" (
  "id" SERIAL NOT NULL, 
  "price" integer NOT NULL, 
  "firstRegistrationDate" TIMESTAMP NOT NULL, 
  "discount" boolean NOT NULL DEFAULT false, 
  "manufacturerId" integer, 
  CONSTRAINT "PK_CarId" PRIMARY KEY ("id"),
  CONSTRAINT "FK_CarManfacturerId" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE "car_owners" (
  "carId" integer NOT NULL, 
  "ownerId" integer NOT NULL, 
  CONSTRAINT "PK_CarOwnersId" PRIMARY KEY ("carId", "ownerId"),
  CONSTRAINT "FK_CarOwnersCarId" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT "FK_CarOwnersOwnerId" FOREIGN KEY ("ownerId") REFERENCES "owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
`;

export class Schema1586959966793 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(SCHEMA);
  }

  public async down(): Promise<any> {
    throw new Error("Can't revert database schema initialization");
  }
}
