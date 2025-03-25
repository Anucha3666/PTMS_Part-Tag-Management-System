import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GuardsModule } from '../guards/guards.module';
import { AccountController, AccountsController } from './account.controller';
import { Account, AccountSchema } from './account.entity';
import { AccountsService } from './account.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    GuardsModule,
  ],
  controllers: [AccountController, AccountsController],
  providers: [AccountsService],
})
export class AccountsModule {}
