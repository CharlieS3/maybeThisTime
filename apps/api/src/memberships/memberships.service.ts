import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMembershipDto } from './dto/create-membership.dto';

@Injectable()
export class MembershipsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll() {
    const result = await this.db.query(
      `SELECT profile_id AS "profileId", brewery_id AS "breweryId", role
       FROM memberships`,
    );
    return result.rows;
  }

  async create(dto: CreateMembershipDto) {
    const result = await this.db.query(
      `INSERT INTO memberships (profile_id, brewery_id, role)
       VALUES ($1, $2, $3)
       RETURNING profile_id AS "profileId", brewery_id AS "breweryId", role`,
      [dto.profileId, dto.breweryId, dto.role.toUpperCase()],
    );
    return result.rows[0];
  }
}