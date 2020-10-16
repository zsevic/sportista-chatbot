import { Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { LOCATION_RADIUS_METERS } from 'common/config/constants';
import { methodTransformToDto } from 'common/decorators';
import { UserLocation } from 'common/dtos';
import { Participation } from './participation.dto';
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
      .where('activity.id = CAST(:id AS uuid)', { id: activity_id })
      .andWhere('participant.id = CAST(:id AS bigint)', { id: participant_id })
      .andWhere('activity.datetime > :now', {
        now: new Date().toDateString(),
      })
      .getOne();
    if (!participation) throw new Error("Participation doesn't exist");

    await this.softRemove(participation);
    return Promise.resolve();
  };

  @methodTransformToDto(Participation)
  async createParticipation(
    activity_id: string,
    userLocation: UserLocation,
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
        { participant_id: userLocation.userId },
      )
      .andWhere(
        'ST_Distance(ST_Point(location.longitude, location.latitude)::geography, ST_Point(:longitude, :latitude)::geography) < :distance',
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          distance: LOCATION_RADIUS_METERS,
        },
      )
      .andWhere('activity.datetime > :now', {
        now: new Date().toDateString(),
      })
      .withDeleted()
      .getOne();

    if (participation) {
      this.logger.log(
        `User ${userLocation.userId} already joined activity ${activity_id}`,
      );
      throw new Error('User already joined the activity');
    }

    return this.save({ activity_id, participant_id: userLocation.userId });
  }

  removeParticipationList = async (activity_id: string): Promise<void> => {
    const participationList = await this.find({ where: { activity_id } });

    await this.softRemove(participationList);
    return Promise.resolve();
  };
}
