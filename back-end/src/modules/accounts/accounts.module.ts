import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuardsModule } from '../guards/guards.module';
import { Account, AccountSchema } from './account.entity';
import { AccountController, AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    GuardsModule,
  ],
  controllers: [AccountController, AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
