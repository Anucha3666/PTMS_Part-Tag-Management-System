import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({ versionKey: false })
export class Account {
  @Prop({ required: true })
  employee_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  section: string;

  @Prop({ required: true })
  position: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  company: string;

  @Prop()
  auth?: string;

  @Prop()
  on_line_at?: Date;

  @Prop({ default: () => new Date() })
  created_at?: Date;

  @Prop({ default: () => new Date() })
  updated_at?: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
