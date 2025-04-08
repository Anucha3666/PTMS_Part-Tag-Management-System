import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TPrintedSummary } from 'src/types';

export type PrintedDocument = Printed & Document;

@Schema({ versionKey: false })
export class Printed {
  @Prop({ required: true })
  printed_by: string;

  @Prop({ default: () => [] })
  tags: string[];

  @Prop({ default: () => [] })
  summary: TPrintedSummary[];

  @Prop({ default: () => new Date() })
  printed_at: Date;
}

export const PrintedSchema = SchemaFactory.createForClass(Printed);
