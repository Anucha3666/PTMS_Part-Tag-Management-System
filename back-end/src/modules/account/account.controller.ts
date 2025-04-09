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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
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

  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profile_picture', maxCount: 1 }], {
      storage: memoryStorage(),
    }),
  )
  create(
    @Request() req,
    @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
    @Body() createAccountDto: CreateAccountDto,
  ) {
    const account_id = req.user.account_id;

    const profilePicture = files['profile_picture']?.[0] ?? null;

    return this.accountsService.create({
      ...createAccountDto,
      profile_picture: profilePicture,
      approved_by: account_id,
      created_by: account_id,
    });
  }

  @Get(':account_id')
  findOne(@Param('account_id') account_id: string) {
    return this.accountsService.findOne(account_id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  @Patch(':account_id/approve')
  approve(@Request() req: TRequest, @Param('account_id') account_id: string) {
    const approved_by = req.user.account_id;
    return this.accountsService.approve(approved_by, account_id);
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  @Patch(':account_id/reject')
  reject(@Request() req: TRequest, @Param('account_id') account_id: string) {
    const approved_by = req.user.account_id;
    return this.accountsService.reject(approved_by, account_id);
  }

  @UseGuards(RolesGuard)
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

  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  @Patch(':account_id/reset-password')
  resetPassword(@Param('account_id') account_id: string) {
    return this.accountsService.resetPassword(account_id);
  }

  @Put()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'profile_picture', maxCount: 1 }], {
      storage: memoryStorage(),
    }),
  )
  async update(
    @Request() req: TRequest,
    @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
    @Body() data: UpdateAccountDto,
  ) {
    const account_id = req?.user?.account_id;

    const profilePicture = files['profile_picture']?.[0] ?? null;

    return await this.accountsService.update(account_id, {
      ...data,
      profile_picture: profilePicture,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  @Delete(':account_id')
  delete(@Request() req: TRequest, @Param('account_id') account_id: string) {
    const deleted_by = req?.user?.account_id;
    return this.accountsService.delete(deleted_by, account_id);
  }
}

@Controller('accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'owner')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  findAll() {
    return this.accountsService.findAll();
  }
}
