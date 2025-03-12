import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async getDatabaseStatus() {
    try {
      const state = this.connection.readyState;
      const status =
        ['disconnected', 'connected', 'connecting', 'disconnecting'][state] ||
        'unknown';

      const dbStats = await this.connection.db.admin().serverStatus();
      const memoryUsage = dbStats.mem;
      const connections = dbStats.connections;
      const network = dbStats.network;

      return {
        status,
        connections,
        memoryUsage,
        network,
      };
    } catch (error) {
      return {
        error: 'Failed to retrieve database status',
        details: error.message,
      };
    }
  }

  async getDatabaseStats() {
    try {
      const dbStats = await this.connection.db.stats();
      return {
        dbSize: dbStats.dataSize,
        collections: dbStats.collections,
        indexes: dbStats.indexes,
      };
    } catch (error) {
      return {
        error: 'Failed to retrieve database statistics',
        details: error.message,
      };
    }
  }

  async getCurrentOperations() {
    try {
      const operations = await this.connection.db
        .admin()
        .command({ currentOp: 1 });
      return operations;
    } catch (error) {
      return {
        error: 'Failed to retrieve current operations',
        details: error.message,
      };
    }
  }

  async checkReplicaSetStatus() {
    try {
      const replicaStatus = await this.connection.db
        .admin()
        .command({ replSetGetStatus: 1 });
      return replicaStatus;
    } catch (error) {
      return {
        error: 'Failed to retrieve replica set status',
        details: error.message,
      };
    }
  }
}
