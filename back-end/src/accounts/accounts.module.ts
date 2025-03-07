import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountController, AccountsController } from './accounts.controller';
import { Account, AccountSchema } from './schemas/account.schema';
import { AccountsService } from './accounts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  controllers: [AccountController, AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
