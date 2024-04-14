import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { Ctx, Payload, RmqContext } from '@nestjs/microservices';
import { QueueService } from '@app/common';

@Controller()
export class OrderController {

  constructor(
    private readonly orderService: OrderService,
    private readonly rmqService: QueueService
  ) { }

  @Get()
  getHello(): string {
    return this.orderService.getHello();
  }


  // change this handler to handle payments and accept payment!
  async handleProductCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    await this.orderService.handleProductCreated(data)
    await this.rmqService.ack(context)
  }
}
