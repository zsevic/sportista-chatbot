import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityRepository } from 'modules/activity/activity.repository';
import { ParticipationRepository } from './participation.repository';
import { ParticipationService } from './participation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActivityRepository, ParticipationRepository]),
  ],
  providers: [ParticipationService],
  exports: [ParticipationService],
})
export class ParticipationModule {}
