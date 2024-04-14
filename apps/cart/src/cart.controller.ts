import { Controller, Logger } from '@nestjs/common';
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
    return await this.queueSvc.ack(context)

  }

  @EventPattern('remove_product_from_cart')
  async handleRemoveProductFromCart(
    @Payload() data: any,
    @Ctx() context: RmqContext
  ) {
    const userId = data.userId
    const productId = data.productId

    await this.cartService.removeProductFromCart(userId, productId)
    return await this.queueSvc.ack(context)
  }
}
