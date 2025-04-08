import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuardsModule } from '../guards';
import { Part, PartSchema } from '../part/part.entity';
import { Printed, PrintedSchema } from '../printed/printed.entity';
import { Tag, TagSchema } from '../tag/tag.entity';
import { PrintController } from './print.controller';
import { PrintService } from './print.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Printed.name, schema: PrintedSchema }]),
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    MongooseModule.forFeature([{ name: Part.name, schema: PartSchema }]),
    GuardsModule,
  ],
  controllers: [PrintController],
  providers: [PrintService],
})
export class PrintModule {}
