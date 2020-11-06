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
  async acceptParticipation(
    participationId: string,
    organizerId: number,
  ): Promise<void> {
    const participation = await this.participationRepository.acceptParticipation(
      participationId,
      organizerId,
    );
    await this.activityRepository.subtractRemainingVacancies(
      participation.activity_id,
      organizerId,
    );
  }

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

  getParticipationListAndCount = async (activityId: string) =>
    this.participationRepository.findAndCount({
      where: { activity_id: activityId },
      relations: ['activity', 'participant'],
    });

  getReceivedRequestList = async (userId: number, page: number) =>
    this.participationRepository.getReceivedRequestList(userId, page);

  getSentRequestList = async (userId: number, page: number) =>
    this.participationRepository.getSentRequestList(userId, page);

  rejectParticipation = async (participationId: string, organizerId: number) =>
    this.participationRepository.rejectParticipation(
      participationId,
      organizerId,
    );
}
