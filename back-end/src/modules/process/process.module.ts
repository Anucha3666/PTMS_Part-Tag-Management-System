import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MicroServiceUplode } from 'src/services';
import { GuardsModule } from '../guards/guards.module';
import { ProcessController, ProcessesController } from './process.controller';
import { Process, ProcessSchema } from './process.entity';
import { ProcessService } from './process.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Process.name, schema: ProcessSchema }]),
    GuardsModule,
    HttpModule,
  ],
  controllers: [ProcessController, ProcessesController],
  providers: [ProcessService, MicroServiceUplode],
})
export class ProcessModule {}
