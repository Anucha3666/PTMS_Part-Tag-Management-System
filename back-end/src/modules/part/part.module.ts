import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuardsModule } from '../guards';
import { PartController, PartsController } from './part.controller';
import { Part, PartSchema } from './part.entity';
import { PartService } from './part.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Part.name, schema: PartSchema }]),
    GuardsModule,
  ],
  controllers: [PartController, PartsController],
  providers: [PartService],
})
export class PartModule {}
