import { Controller, Get, Post, Body } from '@nestjs/common';
import { BreweriesService } from './breweries.service';
import { CreateBreweryDto } from './dto/create-brewery.dto';

@Controller('breweries')
export class BreweriesController {

    constructor (private breweriesService: BreweriesService) {}

    @Get()
    findAllBreweries() {
        return this.breweriesService.findAll();
    }

    @Post()
    create(@Body() dto: CreateBreweryDto) {
        return this.breweriesService.create(dto);
    }
}

// npm run start:dev
// http://localhost:3000/breweries