import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../guards';
import { PrintedService } from './printed.service';

@Controller('printeds')
@UseGuards(JwtAuthGuard)
export class PrintedsController {
  constructor(private readonly printedService: PrintedService) {}

  @Get()
  findAll() {
    return this.printedService.findAll();
  }
}
