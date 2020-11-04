import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ActivityRepository } from 'modules/activity/activity.repository';
import { PARTICIPATION_STATUS } from './participation.enums';
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

  getParticipationsAndCount = async (activityId: string) =>
    this.participationRepository.findAndCount({
      where: { activity_id: activityId },
      relations: ['activity', 'participant'],
    });

  getReceivedParticipationRequestList = async (userId: number) =>
    this.participationRepository.getReceivedParticipationRequestList(userId);

  getSentParticipationRequestList = async (userId: number) =>
    this.participationRepository.findAndCount({
      where: { participant_id: userId, status: PARTICIPATION_STATUS.PENDING },
      relations: [
        'activity',
        'participant',
        'activity.location',
        'activity.price',
      ],
    });
}
