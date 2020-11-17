import { Logger } from '@nestjs/common';
import { PAGE_SIZE } from 'common/config/constants';
import { getSkip } from 'common/utils';
import { BotUserOptions } from 'modules/bot-user/user.types';
import { EntityRepository, Repository } from 'typeorm';
import { ParticipationEntity } from './participation.entity';
import { PARTICIPATION_STATUS } from './participation.enums';

@EntityRepository(ParticipationEntity)
export class ParticipationRepository extends Repository<ParticipationEntity> {
  private readonly logger = new Logger(ParticipationRepository.name);

  acceptParticipation = async (
    id: string,
    organizerOptions: BotUserOptions,
  ) => {
    const [platformIdKey] = Object.keys(organizerOptions);
    const participation = await this.createQueryBuilder('participation')
      .leftJoinAndSelect('participation.activity', 'activity')
      .leftJoinAndSelect('activity.organizer', 'organizer')
      .where('participation.id = CAST(:id AS uuid)', {
        id,
      })
      .andWhere(
        `organizer.${platformIdKey} = :${platformIdKey}`,
        organizerOptions,
      )
      .andWhere('participation.status = :status', {
        status: PARTICIPATION_STATUS.PENDING,
      })
      .getOne();

    if (!participation) throw new Error('Participation is not valid');

    return this.save({
      ...participation,
      status: PARTICIPATION_STATUS.ACCEPTED,
    });
  };

  cancelParticipation = async (
    activityId: string,
    participantOptions: BotUserOptions,
  ) => {
    const [platformIdKey] = Object.keys(participantOptions);
    const participation = await this.createQueryBuilder('participation')
      .leftJoin('participation.activity', 'activity')
      .leftJoinAndSelect('participation.participant', 'participant')
      .where('activity.id = CAST(:activityId AS uuid)', { activityId })
      .andWhere(
        `participant.${platformIdKey} = :${platformIdKey}`,
        participantOptions,
      )
      .andWhere('activity.datetime > :now', {
        now: new Date().toUTCString(),
      })
      .andWhere('participation.status IN (:...status)', {
        status: [PARTICIPATION_STATUS.ACCEPTED, PARTICIPATION_STATUS.PENDING],
      })
      .getOne();
    if (!participation) throw new Error("Participation doesn't exist");

    return this.save({
      ...participation,
      status: PARTICIPATION_STATUS.CANCELED,
    });
  };

  async createParticipation(
    activityId: string,
    participantId: string,
  ): Promise<ParticipationEntity> {
    const participation = await this.createQueryBuilder('participation')
      .leftJoinAndSelect('participation.activity', 'activity')
      .leftJoin('participation.participant', 'participant')
      .leftJoinAndSelect('activity.location', 'location')
      .where('participation.activity_id = CAST(:activityId AS uuid)', {
        activityId,
      })
      .andWhere('participation.participant_id = CAST(:participantId AS uuid)', {
        participantId,
      })
      .withDeleted()
      .getOne();

    if (participation) {
      this.logger.log(
        `User ${participantId} already applied for activity ${activityId}`,
      );
      throw new Error('User already applied for the activity');
    }

    return this.save({
      activity_id: activityId,
      participant_id: participantId,
      status: PARTICIPATION_STATUS.PENDING,
    });
  }

  getReceivedRequestList = async (
    organizerOptions: BotUserOptions,
    page: number,
  ) => {
    const skip = getSkip(page);
    const [platformIdKey] = Object.keys(organizerOptions);

    return this.createQueryBuilder('participation')
      .leftJoinAndSelect('participation.participant', 'participant')
      .leftJoinAndSelect('participation.activity', 'activity')
      .leftJoinAndSelect('activity.location', 'location')
      .leftJoinAndSelect('activity.organizer', 'organizer')
      .leftJoinAndSelect('activity.price', 'price')
      .where(`organizer.${platformIdKey} = :${platformIdKey}`, organizerOptions)
      .andWhere('participation.status = :status', {
        status: PARTICIPATION_STATUS.PENDING,
      })
      .skip(skip)
      .take(PAGE_SIZE)
      .getManyAndCount();
  };

  getSentRequestList = async (
    participantOptions: BotUserOptions,
    page: number,
  ) => {
    const skip = getSkip(page);
    const [platformIdKey] = Object.keys(participantOptions);

    return this.createQueryBuilder('participation')
      .leftJoinAndSelect('participation.participant', 'participant')
      .leftJoinAndSelect('participation.activity', 'activity')
      .leftJoinAndSelect('activity.location', 'location')
      .leftJoinAndSelect('activity.price', 'price')
      .where(
        `participant.${platformIdKey} = :${platformIdKey}`,
        participantOptions,
      )
      .where('participation.status = :status', {
        status: PARTICIPATION_STATUS.PENDING,
      })
      .skip(skip)
      .take(PAGE_SIZE)
      .getManyAndCount();
  };

  rejectParticipation = async (
    id: string,
    organizerOptions: BotUserOptions,
  ) => {
    const [platformIdKey] = Object.keys(organizerOptions);
    const participation = await this.createQueryBuilder('participation')
      .leftJoinAndSelect('participation.activity', 'activity')
      .leftJoinAndSelect('activity.organizer', 'organizer')
      .where('participation.id = CAST(:id AS uuid)', {
        id,
      })
      .andWhere(
        `organizer.${platformIdKey} = :${platformIdKey}`,
        organizerOptions,
      )
      .andWhere('participation.status = :status', {
        status: PARTICIPATION_STATUS.PENDING,
      })
      .getOne();

    if (!participation) throw new Error('Participation is not valid');

    return this.save({
      ...participation,
      status: PARTICIPATION_STATUS.REJECTED,
    });
  };

  removeParticipationList = async (activity_id: string): Promise<void> => {
    const participationList = await this.find({ where: { activity_id } });

    await this.softRemove(participationList);
    return Promise.resolve();
  };
}
