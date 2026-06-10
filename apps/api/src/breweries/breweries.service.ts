import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BreweriesService {
  constructor(private databaseService: DatabaseService) {}

  async findAll() {
    const result = await this.databaseService.query(
      'SELECT id, name FROM breweries'
    );
    return result.rows;
  }
}