import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MicroServiceUplode } from 'src/services';
import { GuardsModule } from '../guards/guards.module';
import { AccountController, AccountsController } from './account.controller';
import { Account, AccountSchema } from './account.entity';
import { AccountsService } from './account.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    GuardsModule,
    HttpModule,
  ],
  controllers: [AccountController, AccountsController],
  providers: [AccountsService, MicroServiceUplode],
})
export class AccountsModule {}
