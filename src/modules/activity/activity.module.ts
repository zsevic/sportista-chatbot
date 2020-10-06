import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipationRepository } from 'modules/participation/participation.repository';
import { StateRepository } from 'modules/state/state.repository';
import { ActivityRepository } from './activity.repository';
import { ActivityService } from './activity.service';
import { LocationRepository } from './location/location.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ActivityRepository,
      LocationRepository,
      ParticipationRepository,
      StateRepository,
    ]),
  ],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
