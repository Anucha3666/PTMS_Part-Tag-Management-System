import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './configs/database.config';
import { AccountsModule } from './modules/account/account.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { MongooseSchemaModule } from './modules/database/mongoose-schema.module';

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
    AccountsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
