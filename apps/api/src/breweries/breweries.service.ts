import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateBreweryDto } from './dto/create-brewery.dto';

@Injectable()
export class BreweriesService {
  constructor(private databaseService: DatabaseService) {}

  async findAll() {
    const result = await this.databaseService.query(
      'SELECT id, name FROM breweries'
    );
    return result.rows;
  }

  async create(dto: CreateBreweryDto) {
    const result = await this.databaseService.query(
        `INSERT INTO breweries (name) 
        VALUES ($1) 
        RETURNING id, name`,
        [dto.name],
    );
    return result.rows[0];
  }
}