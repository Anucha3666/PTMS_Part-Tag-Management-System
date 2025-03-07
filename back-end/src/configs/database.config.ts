import { registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  mongodb: {
    uri: `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DATABASE}`,
    options: {
      authSource: 'admin',
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
      ssl: false,
      tls: false,
      directConnection: true,
      retryWrites: true,
      family: 4,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 15000,
      waitQueueTimeoutMS: 3000,
    },
  },
  sqlServer: {
    host: process.env.SQL_HOST,
    database: process.env.SQL_DATABASE,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
}));
