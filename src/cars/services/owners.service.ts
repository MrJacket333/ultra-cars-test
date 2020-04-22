import { OwnersRepository } from './../repositories/owners.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OwnersService {

  constructor(
    @InjectRepository(OwnersRepository) private ownersRepo: OwnersRepository
    ) {}

  /**
   * Remove all cars' owners before given purchase date 
   * @param {Date} maxPurchaseDate Maximum purchase date
   * @returns {Promise<number>} Deleted owners count
   */
  public batchRemoveBeforePurchaseDate(maxPurchaseDate: Date): Promise<number> {
    return this.ownersRepo.deleteBatchBeforePurchaseDate(maxPurchaseDate);
  }
}
