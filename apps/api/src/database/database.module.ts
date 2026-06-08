/*
AppModule connects the entire backend together.

AppModule
  → imports DatabaseModule

DatabaseModule
  → provides DatabaseService

DatabaseService
  → talks to PostgreSQL

Very simply: database.module.ts tells NestJS: “Here is the database service, and other 
parts of the app are allowed to use it.”

We need it so DatabaseService is set up once and can be reused by things 
like ProfilesService, BreweriesService, and future services.
*/

import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Module({
    // Providers tell NEstJS which classes it should create and manage for you
    // So here we are saying create one DatabaseService instance which other classes can then use
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}