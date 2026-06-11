// UnauthorizedException = Nest's ready-made 401 error.
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { DatabaseService } from '../database/database.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async login(dto: LoginDto) {
    // Look up the user. This is the ONE place password_hash may be selected —
    // it never leaves this method.
    const result = await this.databaseService.query(
      `SELECT id, username, first_name AS "firstName", last_name AS "lastName",
              password_hash AS "passwordHash"
       FROM profiles
       WHERE username = $1`,
      [dto.username],
    );

    const user = result.rows[0]; // undefined if no such username

    // SECURITY SUBTLETY #1: the same vague error for "no such user" and
    // "wrong password". If we said which one it was, an attacker could
    // probe which usernames exist (called "user enumeration").
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // argon2.verify(storedHash, attemptedPassword) → true/false.
    // It re-hashes the attempt with the same salt/settings (both are
    // stored inside the hash string) and compares.
    const passwordOk = await argon2.verify(user.passwordHash, dto.password);

    if (!passwordOk) {
      // SECURITY SUBTLETY #2: same message again, on purpose.
      throw new UnauthorizedException('Invalid credentials');
    }


    // Fetch every brewery this profile belongs to (option B: user picks one).
    const membershipsResult = await this.databaseService.query(
      `SELECT m.brewery_id AS "breweryId", b.name AS "breweryName", m.role
       FROM memberships m
       JOIN breweries b ON b.id = m.brewery_id
       WHERE m.profile_id = $1`,
      [user.id],
    );

    // Credentials are good. For now, return who they are —
    // sessions/tokens come in the next step.
    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      breweries: membershipsResult.rows, // [{ breweryId, breweryName, role }]
    };
  }
}