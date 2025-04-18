import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ versionKey: false })
export class Customer {
  @Prop({ required: true, unique: true })
  customer_name: string;

  @Prop({ default: '' })
  customer_description: string;

  @Prop({ default: null })
  logo?: string | null;

  @Prop({ default: () => new Date() })
  created_at?: Date;

  @Prop({ default: () => new Date() })
  updated_at?: Date;

  @Prop({ default: null })
  created_by?: string;

  @Prop({ default: false })
  is_deleted?: boolean;

  @Prop({ default: null })
  deleted_at?: Date;

  @Prop({ default: null })
  deleted_by?: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

// CustomerSchema.index({ is_deleted: 1, username: 1 });
// CustomerSchema.index({ deleted_at: 1 }, { expireAfterSeconds: 15552000 }); // 6 เดือน = 15,552,000 วินาที
