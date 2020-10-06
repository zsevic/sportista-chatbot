import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ActivityRepository } from 'modules/activity/activity.repository';
import { ParticipationRepository } from './participation.repository';

@Injectable()
export class ParticipationService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    private readonly participationRepository: ParticipationRepository,
  ) {}

  @Transactional()
  async cancelParticipation(
    activityId: string,
    participantId: number,
  ): Promise<void> {
    await this.participationRepository.cancelParticipation(
      activityId,
      participantId,
    );
    await this.activityRepository.addRemainingVacancies(activityId);
  }
}
