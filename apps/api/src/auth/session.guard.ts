/*
This file is meant to answer two questions:

Are you logged in at all?" — the gatekeeping. Valid, unexpired session or you get a 401 and the request 
never reaches the controller. This is the actual guard part.

"And who are you?" — the bonus. Since the lookup already found the profile, we stick it on req.user so the 
code behind the gate knows who's asking. That's what tenancy will be built on later ("show me my brewery's inventory").



Think of it as a bouncer that checks your ticket, and if it's valid, pins a name tag on you before letting you through.
*/

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { isUUID } from 'class-validator';

@Injectable()
export class SessionGuard implements CanActivate {
  // Guards are classes Nest manages, so injection works
  // exactly like in services.
  constructor(private readonly databaseService: DatabaseService) {}

  // ExecutionContext — a wrapper around the incoming request; we'll unwrap it to get the Express req
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Unwrap the generic context to get the Express request.
    // (The generic wrapper exists because Nest also supports non-HTTP
    // apps like websockets — we just tell it "this is HTTP".)
    const req = context.switchToHttp().getRequest();

    const sessionId = req.cookies.session_id;

    // 1) No ticket presented at all or invalid session ID format  → reject immediately, no DB trip.
    // What we have done is hide information from a possible attacker. Every flavor of bad ticket (regarding cookies) — missing, 
    // malformed, unknown, expired, logged-out — produces one identical, boring response.
    if (!sessionId || !isUUID(sessionId)) {
      throw new UnauthorizedException();
    }

    // 2) Look up the ticket. JOIN pulls the profile in the same query,
    //    and the expires_at check makes expired rows invisible.
    const result = await this.databaseService.query(
      `SELECT p.id,
              p.username,
              p.first_name AS "firstName",
              p.last_name  AS "lastName"
       FROM sessions s
       JOIN profiles p ON p.id = s.profile_id
       WHERE s.id = $1 AND s.expires_at > now()`,
      [sessionId],
    );

    // 3) No row → unknown, logged-out, or expired session.
    //    Deliberately the same vague 401 in every failure case.
    if (result.rows.length === 0) {
      throw new UnauthorizedException();
    }

    // 4) Success: attach the user to the request so the controller
    //    (and later, tenancy checks) knows WHO is calling.
    req.user = result.rows[0];
    return true;
  }
}


// curl.exe -c cookies.txt -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d "{\"username\":\"Albert\",\"password\":\"password1234\"}"

// curl.exe -i http://localhost:3000/profiles -H "Cookie: session_id=banana"