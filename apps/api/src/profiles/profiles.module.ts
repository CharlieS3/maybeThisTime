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





// 1. Add DatabaseModule
// 2. Import it into ProfilesModule
// 3. Inject DatabaseService into ProfilesService
// 4. Run INSERT query from createProfile()