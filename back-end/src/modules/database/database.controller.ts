import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Controller('api/database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get('status')
  async getDatabaseStatus() {
    return this.databaseService.getDatabaseStatus();
  }

  @Get('stats')
  async getDatabaseStats() {
    return this.databaseService.getDatabaseStats();
  }

  @Get('current-operations')
  async getCurrentOperations() {
    return this.databaseService.getCurrentOperations();
  }

  @Get('replica-set-status')
  async checkReplicaSetStatus() {
    return this.databaseService.checkReplicaSetStatus();
  }
}
