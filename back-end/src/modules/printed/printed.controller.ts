import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { TRequest } from 'src/types';
import { JwtAuthGuard, Roles, RolesGuard } from '../guards';
import { CreatePrintedDto } from './printed.dto';
import { PrintedService } from './printed.service';

@Controller('print')
export class PrintController {
  constructor(private readonly printedService: PrintedService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin', 'owner')
  @Post()
  create(@Request() req: TRequest, @Body() body: CreatePrintedDto) {
    const account_id = req.user.account_id;

    return this.printedService.create({
      ...body,
      printed_by: account_id,
    });
  }
}

@Controller('printed')
export class PrintedController {
  constructor(private readonly printedService: PrintedService) {}

  @Get(':printed_id')
  findOne(@Param('printed_id') printed_id: string) {
    return this.printedService.findOne(printed_id);
  }
}

@Controller('printeds')
@UseGuards(JwtAuthGuard)
export class PrintedsController {
  constructor(private readonly printedService: PrintedService) {}

  @Get()
  findAll() {
    return this.printedService.findAll();
  }
}
