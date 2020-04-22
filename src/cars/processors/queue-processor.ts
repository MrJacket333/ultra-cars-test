import { CarsApplyDiscount } from './../interfaces/CarsApplyDiscount';
import { CarsService } from '../services/cars.service';
import { RemoveOwnersBatch } from '../interfaces/OwnersRemoveBatch';
import { OwnersService } from '../services/owners.service';
import { Processor, Process, OnQueueActive, OnQueueCompleted } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('cars-bg')
export class QueueProcessor {

  constructor(
    private ownersService: OwnersService,
    private carsService: CarsService
  ) {}

  @OnQueueActive()
  onActive(job: Job<unknown>) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with input ${JSON.stringify(job.data)}...`,
    );
  }

  @Process({name: 'ownersBatchRemove'})
  async removeOwners(job: Job<RemoveOwnersBatch>): Promise<number> {
    return this.ownersService.batchRemoveBeforePurchaseDate(job.data.maxPurchaseDate);
  }

  @Process({name: 'carsApplyDiscount'})
  async carsApplyDiscount(job: Job<CarsApplyDiscount>): Promise<number> {
    return this.carsService.applyDiscount(job.data.minDate, job.data.maxDate);
  }

  @OnQueueCompleted({name: 'ownersBatchRemove'})
  async ownersRemoveCompleted(job: Job<RemoveOwnersBatch>, removedOwners: number) {
    console.log(`Finished removing owners from database: ${removedOwners}`);
  }

  @OnQueueCompleted({name: 'carsApplyDiscount'})
  async discountApplyCompleted(job: Job<CarsApplyDiscount>, updatedCarsCount) {
    console.log(`Finished applying discount to cars: ${updatedCarsCount}`);
  }
}