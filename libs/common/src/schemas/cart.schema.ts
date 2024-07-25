import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database/abstract.schema';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Cart extends AbstractDocument {
  @Prop({ required: true, ref: 'User', type: SchemaTypes.ObjectId })
  userId: {
    type: Types.ObjectId;
  };

  @Prop({ required: true })
  product: [
    {
      productId: Types.ObjectId;
      productName: string;
      price: number;
    },
  ];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
