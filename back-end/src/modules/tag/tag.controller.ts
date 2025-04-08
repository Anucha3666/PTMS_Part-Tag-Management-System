import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';

import { CommonHelper } from 'src/helpers';
import { TREQTagValidationBody, TRequest } from 'src/types';
import { JwtAuthGuard } from '../guards';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  commonHelper = CommonHelper;
  constructor(private readonly tagService: TagService) {}

  @Get(':tag_no')
  findOne(@Param('tag_no') tag_no: string) {
    return this.tagService.findOne(tag_no);
  }

  @Patch(':tag_no')
  validationTag(
    @Request() req: TRequest,
    @Param('tag_no') tag_no: string,
    @Body() body: TREQTagValidationBody,
  ) {
    const account_id = req.user.account_id;

    if (body?.type === 'daikin') {
      return this.tagService.validationTagDaikin({
        tag_no: tag_no,
        ...body,
        checked_by: account_id,
      });
    } else {
      this?.commonHelper?.httpExceptionError(`Unsupported type: ${body?.type}`);
    }
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
