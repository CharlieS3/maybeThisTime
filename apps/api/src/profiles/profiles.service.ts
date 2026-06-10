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
            'SELECT id, first_name AS "firstName" FROM profiles' //needs to be updated everytime we add new columns
        );
        return result.rows;
    }

    // RETURNING gives back the new row (aliased to camelCase
    // Create a new Profile
    async create(dto: CreateProfileDto) {
        // Everything inside this callback is one all-or-nothing unit.
        return this.databaseService.transaction(async (client) => {
            // 1) Create the profile. Note: client.query, NOT this.db.query —
            //    we must stay on the transaction's dedicated connection.
            const profileResult = await client.query(
                `INSERT INTO profiles (first_name)
                VALUES ($1)
                RETURNING id, first_name AS "firstName"`,
                [dto.firstName],
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