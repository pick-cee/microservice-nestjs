import { AbstractRepository, Cart } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class CartRepository extends AbstractRepository<Cart> {
  protected readonly logger = new Logger(CartRepository.name);

  constructor(
    @InjectModel(Cart.name) cartModel: Model<Cart>,
    @InjectConnection() connection: Connection,
  ) {
    super(cartModel, connection);
  }
}
