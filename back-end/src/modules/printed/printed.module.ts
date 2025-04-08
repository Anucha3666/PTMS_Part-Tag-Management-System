import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuardsModule } from '../guards';
import { Tag, TagSchema } from '../tag/tag.entity';
import { PrintedsController } from './printed.controller';
import { Printed, PrintedSchema } from './printed.entity';
import { PrintedService } from './printed.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Printed.name, schema: PrintedSchema }]),
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    GuardsModule,
  ],
  controllers: [PrintedsController],
  providers: [PrintedService],
})
export class PrintedModule {}
