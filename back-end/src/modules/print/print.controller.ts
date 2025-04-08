import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

import { TRequest } from 'src/types';
import { JwtAuthGuard, Roles, RolesGuard } from '../guards';
import { CreatePrintDto } from './print.dto';
import { PrintService } from './print.service';

@Controller('print')
export class PrintController {
  constructor(private readonly printService: PrintService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user', 'admin', 'owner')
  @Post('/tags')
  printTags(@Request() req: TRequest, @Body() body: CreatePrintDto) {
    const account_id = req.user.account_id;

    return this.printService.printTags({
      ...body,
      print_by: account_id,
    });
  }
}
