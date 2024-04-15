import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "../database/abstract.schema";
import { Types } from "mongoose";


@Schema({ timestamps: true, versionKey: false })
export class Order extends AbstractDocument {
    @Prop({ required: true, ref: 'User' })
    userId: Types.ObjectId

    @Prop({ required: true, ref: 'Cart' })
    cartId: Types.ObjectId

    @Prop({
        type: String,
        enum: ['pending', 'successful', 'failed'],
        default: 'pending',
    })
    status?: string

    @Prop({ required: true, default: 0 })
    totalAmount: number

}

export const OrderSchema = SchemaFactory.createForClass(Order)