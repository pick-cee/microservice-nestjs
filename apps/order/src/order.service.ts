import { Cart, User } from '@app/common';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as paystack from "paystack";
import * as randToken from 'rand-token'
import { OrderRepository } from './order.repository';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    private readonly configSvc: ConfigService,
    private readonly orderRepo: OrderRepository
  ) {
  }

  getHello(): string {
    return 'Hello World!';
  }

  async handleProductCreated(data: any) {
    this.logger.log('Product....', data)
  }

  async handlePayment(userId: any, cartId: any) {
    const p = paystack(this.configSvc.get<string>('PAYSTACK_SECRET_KEY'))
    const user = await this.userModel.findOne({ _id: userId }).exec()
    if (!user) {
      throw new NotFoundException('Register an account')
    }
    const cart = await this.cartModel.findOne({ _id: cartId }).exec()
    if (!cart) {
      throw new NotFoundException('Please make a cart before proceeding to make payment!')
    }

    const totalAmount = cart.product.reduce((accumulator, product: any) => {
      return (accumulator + (product.price))
    }, 0)

    const newOrder = await this.orderRepo.create({
      userId: userId,
      cartId: cartId,
      totalAmount: totalAmount,
    })

    const ref = randToken.generate(16)
    const init = await p.transaction.initialize({
      amount: totalAmount * 100,
      email: user.email,
      name: user.firstName + " " + user.lastName,
      reference: ref
    })
    const verify = await p.transaction.verify(ref)
    if (verify.status === true) {
      await this.orderRepo.findOneAndUpdate({ userId: userId }, { status: 'successful' })
      await this.cartModel.updateOne({ userId: userId }, { $set: { product: [] } }).exec()
    }
    return {
      init,
      newOrder
    }
  }
}
