import { AbstractRepository, Product } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class ProductRepository extends AbstractRepository<Product> {
  protected readonly logger = new Logger(ProductRepository.name);

  constructor(
    @InjectModel(Product.name) prodModel: Model<Product>,
    @InjectConnection() connection: Connection,
  ) {
    super(prodModel, connection);
  }
}
