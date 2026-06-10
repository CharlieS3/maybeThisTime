import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}


// npm run start:dev
// http://localhost:3000/profiles