import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({
  timestamps: true
})

export class Product {
  @Prop({
    type: SchemaTypes.ObjectId,
    auto: true
  })
  _id: Types.ObjectId

  @Prop({
    type: String,
    required: true
  })
  name: string;

  @Prop({
    type: Number,
    required: true
  })
  price: number;

  @Prop({
    type: Number,
    default: 0
  })
  quantity: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);