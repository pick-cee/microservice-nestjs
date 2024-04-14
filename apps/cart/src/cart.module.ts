import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema, DatabaseModule, Product, ProductSchema, QueueModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { CART_SERVICE, PRODUCT_SERVICE } from '../constants/services';
import * as Joi from 'joi'
import { MongooseModule } from '@nestjs/mongoose';
import { CartRepository } from './cart.repository';
import { AuthModule } from 'apps/auth/src/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        RABBIT_URI: Joi.string().required(),
        RABBIT_PRODUCT_QUEUE: Joi.string().required(),
        RABBIT_CART_QUEUE: Joi.string().required()
      }),
      envFilePath: './apps/cart/.env'
    }),
    QueueModule.register({
      name: PRODUCT_SERVICE
    }),
    QueueModule.register({
      name: CART_SERVICE
    }),
    DatabaseModule,
    AuthModule,
    MongooseModule.forFeature(
      [
        { name: Cart.name, schema: CartSchema },
        { name: Product.name, schema: ProductSchema }
      ]),
  ],
  controllers: [CartController],
  providers: [CartService, CartRepository],
})
export class CartModule { }
