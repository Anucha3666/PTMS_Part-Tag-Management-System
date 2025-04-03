import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PrintedDocument = Printed & Document;

@Schema({ versionKey: false })
export class Printed {
  @Prop({ required: true })
  printed_by: string;

  @Prop({ default: () => new Date() })
  printed_at: Date;
}

export const PrintedSchema = SchemaFactory.createForClass(Printed);
