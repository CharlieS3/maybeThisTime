import { Controller, Get } from '@nestjs/common';
import { BreweriesService } from './breweries.service';

@Controller('breweries')
export class BreweriesController {

    constructor (private breweriesService: BreweriesService) {}

    @Get()
    findAllBreweries() {
        return this.breweriesService.findAll();
    }
}

// npm run start:dev
// http://localhost:3000/breweries