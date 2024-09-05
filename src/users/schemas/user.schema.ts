import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";

@Schema({
  timestamps: true
})
export class User {
  @Prop({
    type: SchemaTypes.ObjectId,
    auto: true
  })
  _id: Types.ObjectId

  @Prop({
    type: String,
    unique: true,
    required: true
  })
  email: string;

  @Prop({
    type: String,
    required: true
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);