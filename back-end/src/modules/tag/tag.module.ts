import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuardsModule } from '../guards';
import { TagController, TagsController } from './tag.controller';
import { Tag, TagSchema } from './tag.entity';
import { TagService } from './tag.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    GuardsModule,
  ],
  controllers: [TagController, TagsController],
  providers: [TagService],
})
export class TagModule {}
