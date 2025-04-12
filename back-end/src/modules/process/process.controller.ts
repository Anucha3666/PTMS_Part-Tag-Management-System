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
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { CreateProcessDto, UpdateProcessDto } from './process.dto';
import { ProcessService } from './process.service';

@Controller('process')
@UseGuards(JwtAuthGuard)
export class ProcessController {
  constructor(private readonly processService: ProcessService) {}

  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  @Post()
  create(@Request() req, @Body() createProcessDto: CreateProcessDto) {
    const account_id = req.user.account_id;

    return this.processService.create({
      ...createProcessDto,
      created_by: account_id,
    });
  }

  @Put(':process_id')
  async update(
    @Param('process_id') process_id: string,
    @Body() data: UpdateProcessDto,
  ) {
    return await this.processService.update(process_id, data);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  @Delete(':process_id')
  delete(@Request() req: TRequest, @Param('process_id') process_id: string) {
    const deleted_by = req?.user?.account_id;
    return this.processService.delete(deleted_by, process_id);
  }
}

@Controller('processs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'owner')
export class ProcesssController {
  constructor(private readonly processService: ProcessService) {}

  @Get()
  findAll() {
    return this.processService.findAll();
  }
}
