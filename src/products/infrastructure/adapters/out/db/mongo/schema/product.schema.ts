import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = ProductSchemaClass & Document;

@Schema({ collection: 'products' })
export class ProductSchemaClass {
  @Prop({ type: String })
  _id: string; // Map domain ID to Mongo _id

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(ProductSchemaClass);
