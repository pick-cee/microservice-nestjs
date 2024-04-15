import { Controller, HttpCode, HttpStatus, Logger, Post, Query, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { GetUser, QueueService } from '@app/common';
import { JwtGuard } from 'apps/auth/src/guards';

@Controller('cart')
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

  @UseGuards(JwtGuard)
  @Post('make-payment')
  @HttpCode(HttpStatus.OK)
  async makePayment(
    @GetUser('userId') userId: any,
    @Query('cartId') cartId: any
  ) {
    return this.cartService.makePayment(userId, cartId)
  }
}
