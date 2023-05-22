import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop()
  firstName: string;
  
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  accessToken: string;
  
  @Prop()
  createdBy: string;

  @Prop({ default: 'User' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
