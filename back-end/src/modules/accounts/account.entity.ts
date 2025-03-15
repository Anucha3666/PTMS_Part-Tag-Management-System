import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TRole } from 'src/types';

export type AccountDocument = Account & Document;

@Schema({ versionKey: false })
export class Account {
  @Prop({ required: true, unique: true })
  employee_number: string;

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: () => null })
  role?: TRole;

  @Prop({ default: () => null })
  profile_picture?: string | null;

  @Prop({ default: () => new Date() })
  created_at?: Date;

  @Prop({ default: () => new Date() })
  updated_at?: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
