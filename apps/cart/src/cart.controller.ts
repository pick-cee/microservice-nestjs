import { Controller, Get, Logger } from '@nestjs/common';
import { CartService } from './cart.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { QueueService } from '@app/common';

@Controller()
export class CartController {
  private logger = new Logger(CartController.name)
  constructor(private readonly cartService: CartService,
    private readonly queueSvc: QueueService
  ) { }


  @EventPattern('create_cart')
  async handleCreateCart(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ) {
    const userId = data.userId
    const productId = data.productId
    await this.cartService.addToCart(userId, productId)
    await this.queueSvc.ack(context)

    this.logger.log("Cart has been created....")
  }
}
