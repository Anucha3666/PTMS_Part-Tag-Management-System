import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController, AppService } from '.';
import { databaseConfig } from './configs';
import {
  AccountsModule,
  AuthModule,
  DatabaseModule,
  MongooseSchemaModule,
  PartModule,
} from './modules';
import { PrintModule } from './modules/print/print.module';
import { PrintedModule } from './modules/printed/printed.module';
import { TagModule } from './modules/tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    CacheModule.register({
      ttl: isNaN(Number(process.env.TTL)) ? 10000 : Number(process.env.TTL),
      isGlobal: true,
      max: 100,
    }),
    MongooseSchemaModule,
    DatabaseModule,
    HttpModule,
    AuthModule,
    AccountsModule,
    PartModule,
    PrintModule,
    PrintedModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
