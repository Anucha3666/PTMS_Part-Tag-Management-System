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
    AuthModule,
    AccountsModule,
    PartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
