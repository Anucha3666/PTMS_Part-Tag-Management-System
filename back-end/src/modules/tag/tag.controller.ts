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
import { JwtAuthGuard, Roles, RolesGuard } from '../guards';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  commonHelper = CommonHelper;
  constructor(private readonly tagService: TagService) {}

  @Get(':tag_no/:tag_id')
  findOne(@Param('tag_no') tag_no: string, @Param('tag_id') tag_id: string) {
    return this.tagService.findOne(tag_no, tag_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin', 'owner')
  @Patch(':tag_no/validation')
  validationTag(
    @Request() req: TRequest,
    @Param('tag_no') tag_no: string,
    @Body() body: TREQTagValidationBody,
  ) {
    const account_id = req.user.account_id;

    if (body?.type === 'daikin') {
      return this.tagService.validationTagDaikin({
        ...body,
        tag_no: tag_no,
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
