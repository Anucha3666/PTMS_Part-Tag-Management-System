import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../guards';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get(':tag_id')
  findOne(@Param('tag_id') tag_id: string) {
    return this.tagService.findOne(tag_id);
  }
}

@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll() {
    return this.tagService.findAll();
  }
}
