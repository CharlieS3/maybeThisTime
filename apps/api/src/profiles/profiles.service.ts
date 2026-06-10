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
    async create(firstName: string) {
        const result = await this.databaseService.query(
            `INSERT INTO profiles (first_name)
            VALUES ($1)
            RETURNING id, first_name AS "firstName"`,
            [firstName]
        );
        return result.rows[0];
    }
}



// http://localhost:3000/profiles