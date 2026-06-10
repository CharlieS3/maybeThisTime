import { Body, Controller, Get, Post } from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';

@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get()
  findAll() {
    return this.membershipsService.findAll();
  }

  @Post()
  create(@Body() dto: CreateMembershipDto) {
    return this.membershipsService.create(dto);
  }
}



// Need to be using real profile and brewery ID.
// curl.exe -X POST http://localhost:3000/memberships -H "Content-Type: application/json" -d "{\"profileId\": \"<e047707e-50c9-4ef2-9b20-bba89b541d1f>\", \"breweryId\": \"<8df8d879-dd2f-4321-a2ab-c99027ba6253>\", \"role\": \"owner\"}"