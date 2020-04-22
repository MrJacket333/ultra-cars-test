import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import * as moment from 'moment';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueService {

  constructor(@InjectQueue('cars-bg') private queue: Queue) {}

  /**
   * Add job to remove owners with purchase date before 18 months ago
   */
  public queueOwnersBatchRemove() {
    const maxPurchaseDate = moment().subtract(18, 'months').toDate();
    this._addToQueue('ownersBatchRemove', {maxPurchaseDate});
  }

  /**
   * Apply discount to the cars with registration date 
   * in between 12 and 18 months ago
   */
  public queueCarsApplyDiscount() {
    const minDate = moment().subtract(18, 'months').toDate();
    const maxDate = moment().subtract(12, 'months').toDate();
    this._addToQueue('carsApplyDiscount', {minDate, maxDate});
  }

  /**
   * Add job to the queue
   * @param {string} jobName Job name
   * @param {any} queueData Job input data
   */
  private async _addToQueue(jobName, queueData: any) {    
    const job = await this.queue.getJob(jobName);
    if (!job) {
      this.queue.add(jobName, queueData, {
        removeOnComplete: true
      });
    }
  }

}