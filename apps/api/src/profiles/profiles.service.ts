// argon2 = the hashing library. We only ever store what argon2.hash() returns.
import * as argon2 from 'argon2';

import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { DatabaseService } from 'src/database/database.service';

// injectable to means when this file is imported we can use a new or already created instance
@Injectable()
export class ProfilesService {

    constructor(private readonly databaseService: DatabaseService) {}
    
    // Find all Profiles
    async findAll() {
        const result = await this.databaseService.query(
            `SELECT id,
                    first_name AS "firstName",
                    last_name  AS "lastName",
                    username,
                    email,
                    phone
             FROM profiles`,
        );
        return result.rows;
    }

    // RETURNING gives back the new row (aliased to camelCase
    // Create a new Profile
    async create(dto: CreateProfileDto) {
        // Hash FIRST, outside the transaction — hashing is deliberately slow
        // (that's its defense), so don't hold a DB connection open during it.
        // The output string contains the algorithm, settings, salt and hash
        // all in one — that whole string is what we store.
        const passwordHash = await argon2.hash(dto.password);

        // Everything inside this callback is one all-or-nothing unit.
        return this.databaseService.transaction(async (client) => {
            // 1) Create the profile. Note: client.query, NOT this.db.query —
            //    we must stay on the transaction's dedicated connection.
            const profileResult = await client.query(
                `INSERT INTO profiles (first_name, last_name, username, email, phone, password_hash)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id, first_name AS "firstName", last_name AS "lastName", username, email, phone`,
                // dto.phone may be undefined (it's optional).
                // `?? null` says: "if undefined, store NULL" — explicit is safer than implicit
                [dto.firstName, dto.lastName, dto.username, dto.email, dto.phone ?? null, passwordHash],
            );

            // typescriptprofileResult.rows        // [ { id: "e047...", firstName: "Bob" } ]
            // profileResult.rows[0]     //   { id: "e047...", firstName: "Bob" }
            // We need profile so we can use the id
            const profile = profileResult.rows[0];

            // 2) Create the membership, using the id the DB just generated.
            const membershipResult = await client.query(
                `INSERT INTO memberships (profile_id, brewery_id, role)
                VALUES ($1, $2, $3)
                RETURNING brewery_id AS "breweryId", role`,
                [profile.id, dto.breweryId, dto.role.toUpperCase()],
            );

            // Combine both rows into one response object.
            return { ...profile, ...membershipResult.rows[0] };
        });
    }
}



// http://localhost:3000/profiles


// curl.exe -X POST http://localhost:3000/profiles -H "Content-Type: application/json" -d "{\"firstName\":\"Buddy\",\"lastName\":\"Smith\",\"username\":\"buddy342\",\"email\":\"buddsss@example.com\",\"phone\":\"0612345678\",\"breweryId\":\"8f430a10-04f3-4982-8942-fb2ba2856727\",\"role\":\"OWNER\"}"

// curl.exe -X POST http://localhost:3000/profiles -H "Content-Type: application/json" -d "{\"firstName\":\"Anna\",\"lastName\":\"Brouwer\",\"username\":\"anna01\",\"email\":\"anna@example.com\",\"password\":\"correct horse battery\",\"breweryId\":\"8f430a10-04f3-4982-8942-fb2ba2856727\",\"role\":\"OWNER\"}"