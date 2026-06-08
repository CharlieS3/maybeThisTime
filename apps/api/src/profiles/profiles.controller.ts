import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';

@Controller('profiles')
export class ProfilesController {

    // Find all profiles (only an admin should be able to do this)
    // Localhost:3000/profiles
    @Get()
    findAllProfiles() {
        return 0;
    }

    @Post()
    createProfile(@Body() createProfileDto: CreateProfileDto) {
        return {
            id: createProfileDto.id,
            name: createProfileDto.name
        }
    }






}
