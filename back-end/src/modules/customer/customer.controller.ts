import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { CreateCustomerDto, UpdateCustomerDto } from './customer.dto';
import { CustomerService } from './customer.service';

@Controller('customer')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }], {
      storage: memoryStorage(),
    }),
  )
  create(
    @Request() req,
    @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
    @Body() createCustomerDto: CreateCustomerDto,
  ) {
    const customer_id = req.user.customer_id;

    const logoPicture = files['logo']?.[0] ?? null;

    return this.customerService.create({
      ...createCustomerDto,
      logo: logoPicture,
      created_by: customer_id,
    });
  }

  @Put(':customer_id')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'logo', maxCount: 1 }], {
      storage: memoryStorage(),
    }),
  )
  async update(
    @Param('customer_id') customer_id: string,
    @UploadedFiles() files: { [key: string]: Express.Multer.File[] },
    @Body() data: UpdateCustomerDto,
  ) {
    const profilePicture = files['logo']?.[0]
      ? files['logo']?.[0]
      : (data.logo ?? null);

    return await this.customerService.update(customer_id, {
      ...data,
      logo: profilePicture,
    });
  }

  @UseGuards(RolesGuard)
  @Roles('admin', 'owner')
  @Delete(':customer_id')
  delete(@Request() req: TRequest, @Param('customer_id') customer_id: string) {
    const deleted_by = req?.user?.account_id;
    return this.customerService.delete(deleted_by, customer_id);
  }
}

@Controller('customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'owner')
export class CustomersController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  findAll() {
    return this.customerService.findAll();
  }
}
