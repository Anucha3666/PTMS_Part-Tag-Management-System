import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';

@Injectable()
export class MssqlService {
  private pool: sql.ConnectionPool;

  constructor(private configService: ConfigService) {
    this.initializePool();
  }

  private async initializePool() {
    try {
      const config: sql.config = {
        user: this.configService.get<string>('database.sqlServer.user'),
        password: this.configService.get<string>('database.sqlServer.password'),
        server: this.configService.get<string>('database.sqlServer.host'),
        database: this.configService.get<string>('database.sqlServer.database'),
        options: this.configService.get('database.sqlServer.options'),
      };

      this.pool = await new sql.ConnectionPool(config).connect();
    } catch (error) {
      console.error('Failed to connect to MSSQL:', error);
      throw error;
    }
  }

  async query<T>(queryString: string, params?: any[]): Promise<T> {
    try {
      const request = this.pool.request();

      if (params) {
        params.forEach((param, index) => {
          request.input(`param${index}`, param);
        });
      }

      const result = await request.query(queryString);
      return result.recordset as T;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }
}
