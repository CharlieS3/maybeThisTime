import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesModule } from './profiles/profiles.module';
import { ConfigModule } from '@nestjs/config';

// We load .env in this file
// ConfigModule.forRoot({ isGlobal: true }) reads apps/api/.env and makes DATABASE_URL available everywhere

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ProfilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

