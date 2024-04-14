import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi'
import { QueueModule } from '@app/common';
import { AuthModule } from 'apps/auth/src/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_URI: Joi.string().required(),
        RABBIT_PRODUCT_QUEUE: Joi.string().required()
      }),
      envFilePath: './apps/order/.env'
    }),
    QueueModule,
    AuthModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
