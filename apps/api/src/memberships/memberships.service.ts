import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMembershipDto } from './dto/create-membership.dto';

@Injectable()
export class MembershipsService {
  constructor(private readonly db: DatabaseService) {}


  // m, p, b are table nicknames (aliases). Each JOIN ... ON says "for every membership row, 
  // find the profile/brewery row whose id matches, and let me select its columns too."
  async findAll() {
    const result = await this.db.query(
        `SELECT
          m.profile_id  AS "profileId",
          p.first_name  AS "firstName",
          m.brewery_id  AS "breweryId",
          b.name        AS "breweryName",
          m.role
        FROM memberships m
        JOIN profiles  p ON p.id = m.profile_id
        JOIN breweries b ON b.id = m.brewery_id`,
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