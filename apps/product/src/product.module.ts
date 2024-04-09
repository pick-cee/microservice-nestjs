import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import * as Joi from 'joi'
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, Product, ProductSchema, QueueModule, UploadModule } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PRODUCT_SERVICE } from '../constants/services';
import { AuthModule } from 'apps/auth/src/auth.module';
import { ProductRepository } from './product.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        CLOUDINARY_NAME: Joi.string(),
        CLOUDINARY_API_KEY: Joi.string(),
        CLOUDINARY_API_SECRET: Joi.string()
      }),
      envFilePath: './apps/product/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    QueueModule.register({
      name: PRODUCT_SERVICE
    }),
    AuthModule,
    UploadModule
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule { }
