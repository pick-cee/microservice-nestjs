import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
  Cart,
  CartSchema,
  DatabaseModule,
  Order,
  OrderSchema,
  QueueModule,
  User,
  UserSchema,
} from '@app/common';
import { AuthModule } from 'apps/auth/src/auth.module';
import { CART_SERVICE, ORDER_SERVICE } from './constants/services';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderRepository } from './order.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBIT_URI: Joi.string().required(),
        RABBIT_PRODUCT_QUEUE: Joi.string().required(),
        RABBIT_CART_QUEUE: Joi.string().required(),
        RABBIT_ORDER_QUEUE: Joi.string().required(),
        PAYSTACK_SECRET_KEY: Joi.string().required(),
      }),
      envFilePath: './apps/order/.env',
    }),
    QueueModule.register({
      name: CART_SERVICE,
    }),
    QueueModule.register({
      name: ORDER_SERVICE,
    }),
    AuthModule,
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Cart.name, schema: CartSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
