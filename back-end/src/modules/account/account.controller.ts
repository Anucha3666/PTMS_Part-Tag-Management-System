import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import { TRequest } from 'src/types';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from '../guards/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import {
  ChangeRoleDto,
  CreateAccountDto,
  UpdateAccountDto,
} from './account.dto';
import { AccountsService } from './account.service';

@Controller('account')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  create(@Request() req, @Body() createAccountDto: CreateAccountDto) {
    const account_id = req.user.account_id;

    return this.accountsService.create({
      ...createAccountDto,
      approved_by: account_id,
      created_by: account_id,
    });
  }

  @Get(':account_id')
  findOne(@Param('account_id') account_id: string) {
    return this.accountsService.findOne(account_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'owner')
  @Patch(':account_id/approve')
  approve(@Request() req: TRequest, @Param('account_id') account_id: string) {
    const approved_by = req.user.account_id;
    return this.accountsService.approve(approved_by, account_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'owner')
  @Patch(':account_id/reject')
  reject(@Request() req: TRequest, @Param('account_id') account_id: string) {
    const approved_by = req.user.account_id;
    return this.accountsService.reject(approved_by, account_id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'owner')
  @Patch(':account_id/role')
  changeRole(
    @Request() req: TRequest,
    @Param('account_id') account_id: string,
    @Body() changeRoleDto: ChangeRoleDto,
  ) {
    const change_by = req.user.role;

    return this.accountsService.changeRole(
      change_by,
      account_id,
      changeRoleDto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'owner')
  @Patch(':account_id/reset-password')
  resetPassword(@Param('account_id') account_id: string) {
    return this.accountsService.resetPassword(account_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Request() req: TRequest, @Body() updateAccountDto: UpdateAccountDto) {
    const account_id = req?.user?.account_id;
    return this.accountsService.update(account_id, updateAccountDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'owner')
  @Delete(':account_id')
  delete(@Request() req: TRequest, @Param('account_id') account_id: string) {
    const deleted_by = req?.user?.account_id;
    return this.accountsService.delete(deleted_by, account_id);
  }
}

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll() {
    return this.accountsService.findAll();
  }
}
