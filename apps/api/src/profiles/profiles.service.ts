import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { DatabaseService } from 'src/database/database.service';

// injectable to means when this file is imported we can use a new or already created instance
@Injectable()
export class ProfilesService {

    constructor(private readonly databaseService: DatabaseService) {}
    
    // http://localhost:3000/profiles
    async findAll() {
        const result = await this.databaseService.query('SELECT * FROM profiles');

        return result.rows;
    }

    createProfile(createProfileDto: CreateProfileDto){
        const newProfile = {name: createProfileDto.name};

        return newProfile;
    }
}
