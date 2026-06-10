import { Module } from '@nestjs/common';
import { BreweriesController } from './breweries.controller';
import { BreweriesService } from './breweries.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BreweriesController],
  providers: [BreweriesService]
})
export class BreweriesModule {}


/*
imports: [DatabaseModule],

tells NestJS: "BreweriesModule wants to use what DatabaseModule shares."

Mechanics: DatabaseModule declares DatabaseService in its providers and (crucially) its exports. Any module that lists 
DatabaseModule in imports can then inject DatabaseService into its own classes — that's what makes constructor
(private databaseService: DatabaseService) work inside BreweriesService.

Without that line, NestJS would throw "can't resolve dependencies of BreweriesService" at startup, because dependency 
injection only sees providers from the module itself plus what its imported modules export. It's how Nest keeps features 
compartmentalized — modules state their dependencies explicitly rather than everything being global.

*/