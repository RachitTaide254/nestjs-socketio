import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema()
export class Blog {

  @Prop()
  Title: string;
  
  @Prop()
  description: string;

  @Prop()
  createdBy: string;

  @Prop({default:Date.now})
  createdDate: Date;

}

export const BlogSchema = SchemaFactory.createForClass(Blog);
