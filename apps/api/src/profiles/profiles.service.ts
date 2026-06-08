import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';

// injectable to means when this file is imported we can use a new or already created instance
@Injectable()
export class ProfilesService {
    
    findAll(){
        return 0;
    }

    createProfile(createProfileDto: CreateProfileDto){
        const newProfile = {name: createProfileDto.name};

        return newProfile;
    }
}
