import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { GetUser, QueueService } from '@app/common';
import { JwtGuard } from 'apps/auth/src/guards';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly rmqService: QueueService,
  ) {}

  @Get()
  getHello(): string {
    return this.orderService.getHello();
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('make-payment')
  async handleCreatePayment(
    @GetUser('userId') userId: any,
    @Query('cartId') cartId: any,
  ) {
    return this.orderService.handlePayment(userId, cartId);
  }
}
