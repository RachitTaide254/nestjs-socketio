import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema()
export class Admin {

  @Prop()
  firstName: string;
  
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  accessToken: string;

  @Prop({ default: 'admin' })
  role: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
