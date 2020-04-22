import { QueueService } from './../services/queue.service';
import { Controller, Post, HttpCode } from '@nestjs/common';

@Controller('process')
export class ProcessController {

  constructor(private service: QueueService) {}

  @Post('/discount')
  @HttpCode(200)
  public async triggerProcess(): Promise<string> {
    this.service.queueOwnersBatchRemove();
    this.service.queueCarsApplyDiscount();
    return "Process triggered";
  }
}