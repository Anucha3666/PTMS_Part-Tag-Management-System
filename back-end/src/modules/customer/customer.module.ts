import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MicroServiceUplode } from 'src/services';
import { GuardsModule } from '../guards/guards.module';
import { CustomerController, CustomersController } from './customer.controller';
import { Customer, CustomerSchema } from './customer.entity';
import { CustomerService } from './customer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
    ]),
    GuardsModule,
    HttpModule,
  ],
  controllers: [CustomerController, CustomersController],
  providers: [CustomerService, MicroServiceUplode],
})
export class CustomerModule {}
