import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {

    // NestJS creates the ProfilesService instance from our profiles.service.ts file, then passes it into the constructor.
    // The constructor receives the created instance and allows us to call it later.
    constructor (private profileServices: ProfilesService) {}

    // Find all profiles (only an admin should be able to do this)
    // Localhost:3000/profiles
    @Get()
    findAllProfiles() {
        return this.profileServices.findAll();
    }

    @Post()
    createProfile(@Body() createProfileDto: CreateProfileDto) {
        return this.profileServices.create(createProfileDto.firstName);
    }
}



/*
Running Code: 

Adding a user (Can be in any folder):
curl.exe -X POST http://localhost:3000/profiles -H "Content-Type: application/json" -d "{\"firstName\":\"New Test\"}"



*/