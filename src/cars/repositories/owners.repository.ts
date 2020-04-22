import { Repository, EntityRepository } from 'typeorm';
import { Owner } from './../entities/owner.entity';

@EntityRepository(Owner)
export class OwnersRepository extends Repository<Owner> {

  /**
   * Delete all owners before purchase date
   * @param {Date} maxPurchaseDate Purchase date
   * @returns {Promise<number>} Deleted owners count
   */
  public async deleteBatchBeforePurchaseDate(maxPurchaseDate: Date): Promise<number> {
    const result = await this.createQueryBuilder()
      .delete()
      .from(Owner)
      .where("purchaseDate < :maxPurchaseDate", { maxPurchaseDate })
      .execute();
    return result.affected;
  }
}