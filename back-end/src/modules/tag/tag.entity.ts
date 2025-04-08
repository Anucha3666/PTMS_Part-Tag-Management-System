import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TagDocument = Tag & Document;

@Schema({ versionKey: false })
export class Tag {
  @Prop({ required: true })
  printed_id: string;

  @Prop({ required: true })
  part_id: string;

  @Prop({ required: true, unique: true })
  tag_no: string;

  @Prop({ default: () => null })
  ref_tag: string;

  @Prop({ default: () => null })
  checked_by: string;

  @Prop({ default: () => null })
  checked_at: Date;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
