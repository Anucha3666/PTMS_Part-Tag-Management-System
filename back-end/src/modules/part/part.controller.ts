import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { TRequest } from 'src/types';
import { JwtAuthGuard, Roles, RolesGuard } from '../guards';
import { CreatePartDto, UpdatePartDto } from './part.dto';
import { PartService } from './part.service';

@Controller('part')
export class PartController {
  constructor(private readonly partService: PartService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin', 'owner')
  @Post()
  create(@Request() req: TRequest, @Body() body: CreatePartDto) {
    const account_id = req.user.account_id;

    return this.partService.create({
      ...body,
      created_by: account_id,
    });
  }

  @Get(':part_id')
  findOne(@Param('part_id') part_id: string) {
    return this.partService.findOne(part_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':part_id/change-history')
  findHistoryOfChanges(@Param('part_id') part_id: string) {
    return this.partService.findHistoryOfChanges(part_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin', 'owner')
  @Put(':part_id')
  update(
    @Request() req: TRequest,
    @Param('part_id') part_id: string,
    @Body() body: UpdatePartDto,
  ) {
    const account_id = req?.user?.account_id;
    return this.partService.update(part_id, {
      ...body,
      created_by: account_id,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'owner')
  @Delete(':part_id')
  delete(@Request() req: TRequest, @Param('part_id') part_id: string) {
    const deleted_by = req?.user?.account_id;
    return this.partService.delete(deleted_by, part_id);
  }
}

@Controller('parts')
@UseGuards(JwtAuthGuard)
export class PartsController {
  constructor(private readonly partService: PartService) {}

  @Get()
  findAll() {
    return this.partService.findAll();
  }
}
