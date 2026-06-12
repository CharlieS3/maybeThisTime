import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { BreweriesService } from './breweries.service';
import { CreateBreweryDto } from './dto/create-brewery.dto';
import { SessionGuard } from 'src/auth/session.guard';

@Controller('breweries')
export class BreweriesController {

    constructor (private breweriesService: BreweriesService) {}

    @UseGuards(SessionGuard)
    @Get()
    findAllBreweries() {
        return this.breweriesService.findAll();
    }

    @UseGuards(SessionGuard)
    @Post()
    create(@Body() dto: CreateBreweryDto) {
        return this.breweriesService.create(dto);
    }
}

// npm run start:dev
// http://localhost:3000/breweries