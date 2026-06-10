/*
app.module.ts is the main/root module of the NestJS app
Think of it as the central place that says: This backend app is made of these major pieces.

As the app grows it will import breweries and inventory and other things

This file is not business logic. It just connects all the main pieces
*/

/*
If we consider profiles.module.ts as an example, app.module.ts only imports
ProfilesModule.

profiles.module.ts handles the profiles folder setup:
  - profiles.controller.ts
  - profiles.service.ts
  - any modules profiles needs, like database.module.ts

So by importing ProfilesModule into app.module.ts, we register the profiles
feature with the main NestJS app.

If another module, like breweries.module.ts, needs to use ProfilesService,
then profiles.module.ts would need to export ProfilesService, and
breweries.module.ts would need to import ProfilesModule.

main.ts starts the app.
app.module.ts tells NestJS what the app is made of and registers all the 
imported modules as part of the application.
*/

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesModule } from './profiles/profiles.module';
import { ConfigModule } from '@nestjs/config';
import { BreweriesModule } from './breweries/breweries.module';

// We load .env in this file
// ConfigModule.forRoot({ isGlobal: true }) reads apps/api/.env and makes DATABASE_URL available everywhere

@Module({
  // ConfigModule: When NestJS starts, load environment variables from Code/.env. Make those values available globally across the app.
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ['../../.env'] }), ProfilesModule, BreweriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

