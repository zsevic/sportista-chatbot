import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ParticipationEntity } from './participation.entity';

@EntityRepository(ParticipationEntity)
export class ParticipationRepository extends Repository<ParticipationEntity> {
  private readonly logger = new Logger(ParticipationRepository.name);

  cancelParticipation = async (
    activity_id: string,
    participant_id: number,
  ): Promise<void> => {
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
      .getOne();
    if (!participation) throw new Error("Participation doesn't exist");

    await this.softRemove(participation);
    return Promise.resolve();
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
        `User ${participant_id} already joined activity ${activity_id}`,
      );
      throw new Error('User already joined the activity');
    }

    return this.save({ activity_id, participant_id });
  }

  removeParticipationList = async (activity_id: string): Promise<void> => {
    const participationList = await this.find({ where: { activity_id } });

    await this.softRemove(participationList);
    return Promise.resolve();
  };
}
