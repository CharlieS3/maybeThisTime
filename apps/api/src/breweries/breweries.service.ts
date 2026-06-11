import { Injectable, InternalServerErrorException } from '@nestjs/common';
// randomInt comes from Node itself (no install). Unlike Math.random it's
// cryptographically secure — the right choice since codes act like credentials.
import { randomInt } from 'crypto';
import { DatabaseService } from '../database/database.service';
import { CreateBreweryDto } from './dto/create-brewery.dto';

// Alphabet for codes. 0, O, 1 and I are excluded on purpose —
// people confuse them when reading a code off a screen or saying it aloud.
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;

// Plain helper function
function generateCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    // randomInt(n) gives a random index 0..n-1; pick that character.
    code += CODE_CHARS[randomInt(CODE_CHARS.length)];
  }
  return code;
}

@Injectable()
export class BreweriesService {
  constructor(private databaseService: DatabaseService) {}

  // simply list all breweries
  async findAll() {
    const result = await this.databaseService.query(
      'SELECT id, name, code FROM breweries', // code added
    );
    return result.rows;
  }

  async create(dto: CreateBreweryDto) {
    // Collisions are astronomically rare (32^6 ≈ 1 billion codes),
    // but retry a few times instead of failing.
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateCode();
      try {
        const result = await this.databaseService.query(
          `INSERT INTO breweries (name, code)
           VALUES ($1, $2)
           RETURNING id, name, code`,
          [dto.name, code],
        );
        // Success: return immediately, loop never continues.
        return result.rows[0];
      } catch (err: any) {
        // 23505 = unique violation. Only `code` is UNIQUE on this table,
        // so this means a collision → loop again with a fresh code.
        if (err?.code === '23505') continue;
        // Any other DB error is a real problem → rethrow for our filter.
        throw err;
      }
    }
    // 5 collisions in a row: practically impossible unless something is broken.
    throw new InternalServerErrorException('Could not generate a unique brewery code');
  }
}