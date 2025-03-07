import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sql from 'mssql';

@Injectable()
export class SqlService {
  private pool: sql.ConnectionPool;

  constructor(private configService: ConfigService) {
    this.initializePool();
  }

  private async initializePool() {
    try {
      const sqlConfig = this.configService.get('database.sqlServer');
      this.pool = await new sql.ConnectionPool({
        user: sqlConfig.user,
        password: sqlConfig.password,
        server: sqlConfig.host,
        database: sqlConfig.database,
        options: sqlConfig.options,
      }).connect();
    } catch (error) {
      console.error('SQL Pool initialization error:', error);
      throw error;
    }
  }

  async query(queryString: string, params?: any[]): Promise<any> {
    try {
      const request = this.pool.request();

      if (params) {
        params.forEach((param, index) => {
          request.input(`param${index}`, param);
        });
      }

      const result = await request.query(queryString);
      return result.recordset;
    } catch (error) {
      console.error('SQL Query error:', error);
      throw error;
    }
  }
}
