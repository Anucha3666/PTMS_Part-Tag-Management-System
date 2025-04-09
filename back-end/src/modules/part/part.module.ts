import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MicroServiceUplode } from 'src/services';
import { GuardsModule } from '../guards';
import { PartController, PartsController } from './part.controller';
import { Part, PartSchema } from './part.entity';
import { PartService } from './part.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Part.name, schema: PartSchema }]),
    GuardsModule,
    HttpModule,
  ],
  controllers: [PartController, PartsController],
  providers: [PartService, MicroServiceUplode],
})
export class PartModule {}
