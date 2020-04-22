import { Repository, EntityRepository } from 'typeorm';
import { Manufacturer } from '../entities/manufacturer.entity';

@EntityRepository(Manufacturer)
export class ManufacturerRepository extends Repository<Manufacturer> {}