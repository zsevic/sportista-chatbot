import { Logger } from '@nestjs/common';
import { PAGE_SIZE } from 'common/config/constants';
import { getSkip } from 'common/utils';
import { EntityRepository, Repository } from 'typeorm';
import { ParticipationEntity } from './participation.entity';
import { PARTICIPATION_STATUS } from './participation.enums';

@EntityRepository(ParticipationEntity)
export class ParticipationRepository extends Repository<ParticipationEntity> {
  private readonly logger = new Logger(ParticipationRepository.name);

  acceptParticipation = async (id: string, organizer_id: number) => {
    const participation = await this.createQueryBuilder('participation')
      .leftJoinAndSelect('participation.activity', 'activity')
      .where('participation.id = CAST(:id AS uuid)', {
        id,
      })
      .andWhere('activity.organizer_id = CAST(:organizer_id AS bigint)', {
        organizer_id,
      })
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

  cancelParticipation = async (activity_id: string, participant_id: number) => {
    const participation = await this.createQueryBuilder('participation')
      .leftJoin('participation.activity', 'activity')
      .leftJoin('participation.participant', 'participant')
      .where('activity.id = CAST(:activity_id AS uuid)', { activity_id })
      .andWhere('participant.id = CAST(:participant_id AS bigint)', {
        participant_id,
      })
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
    activity_id: string,
    participant_id: number,
  ): Promise<ParticipationEntity> {
    const participation = await this.createQueryBuilder('participation')
      .leftJoinAndSelect('participation.activity', 'activity')
      .leftJoin('participation.participant', 'participant')
      .leftJoinAndSelect('activity.location', 'location')
      .where('participation.activity_id = CAST(:activity_id AS uuid)', {
        activity_id,
      })
      .andWhere(
        'participation.participant_id = CAST(:participant_id AS bigint)',
        { participant_id },
      )
      .withDeleted()
      .getOne();

    if (participation) {
      this.logger.log(
        `User ${participant_id} already applied for activity ${activity_id}`,
      );
      throw new Error('User already applied for the activity');
    }

    return this.save({
      activity_id,
      participant_id,
      status: PARTICIPATION_STATUS.PENDING,
    });
  }

  getReceivedRequestList = async (userId: number, page: number) => {
    const skip = getSkip(page);

    return this.createQueryBuilder('participation')
      .leftJoinAndSelect('participation.participant', 'participant')
      .leftJoinAndSelect('participation.activity', 'activity')
      .leftJoinAndSelect('activity.location', 'location')
      .leftJoinAndSelect('activity.organizer', 'organizer')
      .leftJoinAndSelect('activity.price', 'price')
      .where('activity.organizer_id = CAST(:organizerId AS bigint)', {
        organizerId: userId,
      })
      .andWhere('participation.status = :status', {
        status: PARTICIPATION_STATUS.PENDING,
      })
      .skip(skip)
      .take(PAGE_SIZE)
      .getManyAndCount();
  };

  getSentRequestList = async (userId: number, page: number) => {
    const skip = getSkip(page);

    return this.findAndCount({
      where: { participant_id: userId, status: PARTICIPATION_STATUS.PENDING },
      relations: [
        'activity',
        'participant',
        'activity.location',
        'activity.price',
      ],
      skip,
      take: PAGE_SIZE,
    });
  };

  rejectParticipation = async (id: string, organizer_id: number) => {
    const participation = await this.createQueryBuilder('participation')
      .leftJoinAndSelect('participation.activity', 'activity')
      .where('participation.id = CAST(:id AS uuid)', {
        id,
      })
      .andWhere('activity.organizer_id = CAST(:organizer_id AS bigint)', {
        organizer_id,
      })
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
