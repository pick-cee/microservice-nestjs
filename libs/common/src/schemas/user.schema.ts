import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class User extends AbstractDocument {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: false })
  password?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
