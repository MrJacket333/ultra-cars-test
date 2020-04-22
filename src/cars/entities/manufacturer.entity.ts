import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Manufacturer {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  siret: number;
}