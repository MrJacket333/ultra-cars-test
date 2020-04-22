import { Owner } from './owner.entity';
import { Manufacturer } from './manufacturer.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, JoinTable, ManyToMany } from "typeorm";

@Entity()
export class Car {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  firstRegistrationDate: Date;

  @ManyToOne(type => Manufacturer, { cascade: false })
  @JoinColumn({
    name: 'manufacturerId',
    referencedColumnName: 'id'
  })
  manufacturer: Manufacturer;

  @Column()
  manufacturerId: number;

  @Column({default: false})
  discount: boolean;

  @ManyToMany(type => Owner)
  @JoinTable({
    name: 'car_owners',
    joinColumn: {
      name: 'carId', referencedColumnName: 'id'

    },
    inverseJoinColumn: {
      name: 'ownerId', referencedColumnName: 'id'
    }
  })
  owners: Owner[];
  
}