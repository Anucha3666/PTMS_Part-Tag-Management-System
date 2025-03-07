import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SqlService } from 'src/shared/services/sql.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongoConfig = configService.get('database.mongodb');
        return {
          uri: mongoConfig.uri,
          ...mongoConfig.options,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [SqlService],
  exports: [SqlService],
})
export class DatabaseModule {}
