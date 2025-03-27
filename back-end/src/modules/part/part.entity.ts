import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PartDocument = Part & Document;

@Schema({ versionKey: false })
export class Part {
  @Prop({ required: true, unique: true })
  part_no: string;

  @Prop({ required: true })
  part_name: string;

  @Prop({ required: true })
  packing_std: number;

  @Prop({ default: () => null })
  picture_std: string | null;

  @Prop({ default: () => null })
  q_point: string | null;

  @Prop({ default: () => null })
  packing: string | null;

  @Prop({ default: () => [] })
  more_pictures: string[] | [];

  @Prop({ default: false })
  is_log: boolean;

  @Prop({ default: () => new Date() })
  created_at: Date;

  @Prop({ default: () => null })
  created_by: string;

  @Prop({ default: false })
  is_deleted: boolean;

  @Prop({ default: () => null })
  deleted_at: Date;

  @Prop({ default: () => null })
  deleted_by: string;
}

export const PartSchema = SchemaFactory.createForClass(Part);
