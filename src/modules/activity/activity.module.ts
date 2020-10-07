import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipationRepository } from 'modules/participation/participation.repository';
import { StateRepository } from 'modules/state/state.repository';
import { ActivityRepository } from './activity.repository';
import { ActivityService } from './activity.service';
import { LocationModule } from './location/location.module';
import { PriceRepository } from './price/price.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ActivityRepository,
      ParticipationRepository,
      PriceRepository,
      StateRepository,
    ]),
    LocationModule,
  ],
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}