import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../database/abstract.schema';

@Schema({ timestamps: true, versionKey: false })
export class Product extends AbstractDocument {
  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false })
  productImage?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
