import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService]
})
export class ProfilesModule {}