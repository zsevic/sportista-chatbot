import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ActivityRepository } from 'modules/activity/activity.repository';
import { BotUserOptions } from 'modules/bot-user/user.types';
import { PARTICIPATION_STATUS } from './participation.enums';
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
    organizerOptions: BotUserOptions,
  ): Promise<void> {
    const participation = await this.participationRepository.acceptParticipation(
      participationId,
      organizerOptions,
    );
    await this.activityRepository.subtractRemainingVacancies(
      participation.activity_id,
      organizerOptions,
    );
  }

  @Transactional()
  async cancelAcceptedParticipation(
    activityId: string,
    participantOptions: BotUserOptions,
  ) {
    const participation = await this.participationRepository.cancelParticipation(
      activityId,
      participantOptions,
    );
    await this.activityRepository.addRemainingVacancies(activityId);

    return participation;
  }

  cancelPendingParticipation = async (
    activityId: string,
    participantOptions: BotUserOptions,
  ) =>
    this.participationRepository.cancelParticipation(
      activityId,
      participantOptions,
    );

  getParticipationListAndCount = async (activityId: string) =>
    this.participationRepository.findAndCount({
      where: {
        activity_id: activityId,
        status: In([
          PARTICIPATION_STATUS.ACCEPTED,
          PARTICIPATION_STATUS.PENDING,
        ]),
      },
      relations: ['activity', 'participant'],
    });

  getReceivedRequestList = async (
    organizerOptions: BotUserOptions,
    page: number,
  ) =>
    this.participationRepository.getReceivedRequestList(organizerOptions, page);

  getSentRequestList = async (
    participantOptions: BotUserOptions,
    page: number,
  ) =>
    this.participationRepository.getSentRequestList(participantOptions, page);

  rejectParticipation = async (
    participationId: string,
    organizerOptions: BotUserOptions,
  ) =>
    this.participationRepository.rejectParticipation(
      participationId,
      organizerOptions,
    );
}
