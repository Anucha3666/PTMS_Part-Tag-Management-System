import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProcessDocument = Process & Document;

@Schema({ versionKey: false })
export class Process {
  @Prop({ required: true, unique: true })
  process_name: string;

  @Prop({ default: () => '' })
  process_description: string;

  @Prop({ default: () => new Date() })
  created_at?: Date;

  @Prop({ default: () => new Date() })
  updated_at?: Date;

  @Prop({ default: () => null })
  created_by?: string;

  @Prop({ default: false })
  is_deleted?: boolean;

  @Prop({ default: () => null })
  deleted_at?: Date;

  @Prop({ default: () => null })
  deleted_by?: string;
}

export const ProcessSchema = SchemaFactory.createForClass(Process);
