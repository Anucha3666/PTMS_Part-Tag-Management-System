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

  @Prop({ default: () => null })
  created_by?: string;

  @Prop({ default: false })
  is_approved?: boolean;

  @Prop({ default: () => null })
  approved_at?: Date;

  @Prop({ default: () => null })
  approved_by?: string;

  @Prop({ default: false })
  is_deleted?: boolean;

  @Prop({ default: () => null })
  deleted_at?: Date;

  @Prop({ default: () => null })
  deleted_by?: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

// AccountSchema.index({ is_deleted: 1, username: 1 });
// AccountSchema.index({ deleted_at: 1 }, { expireAfterSeconds: 15552000 }); // 6 เดือน = 15,552,000 วินาที
