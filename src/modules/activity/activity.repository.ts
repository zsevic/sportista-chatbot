import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import {
  FIRST_PAGE,
  LOCATION_RADIUS_METERS,
  PAGE_SIZE,
} from 'common/config/constants';
import { methodTransformToDto } from 'common/decorators';
import { PaginatedResponse, UserLocation } from 'common/dtos';
import { getSkip } from 'common/utils';
import { ParticipationEntity } from 'modules/participation/participation.entity';
import { Activity } from './activity.dto';
import { ActivityEntity } from './activity.entity';

@EntityRepository(ActivityEntity)
export class ActivityRepository extends Repository<ActivityEntity> {
  @methodTransformToDto(Activity)
  async addRemainingVacancies(
    activity_id: string,
    organizer_id?: number,
  ): Promise<ActivityEntity> {
    let queryBuilder = this.createQueryBuilder('activity')
      .where('activity.id = CAST(:activity_id as uuid)', { activity_id })
      .andWhere('activity.datetime > :now', {
        now: new Date().toUTCString(),
      });

    if (organizer_id) {
      queryBuilder = queryBuilder.andWhere(
        'activity.organizer = CAST(:organizer_id AS bigint)',
        {
          organizer_id,
        },
      );
    }

    const activity = await queryBuilder.getOne();
    if (!activity) throw new Error('Activity is not valid');

    return this.save({
      ...activity,
      remaining_vacancies: activity.remaining_vacancies + 1,
    });
  }

  cancelActivity = async (id: string, organizer_id: number): Promise<void> => {
    const activity = await this.createQueryBuilder('activity')
      .where('activity.id = CAST(:id AS uuid)', { id })
      .andWhere('activity.organizer_id = CAST(:organizer_id AS bigint)', {
        organizer_id,
      })
      .andWhere('activity.datetime > :now', {
        now: new Date().toUTCString(),
      })
      .getOne();

    if (!activity) throw new Error('Activity is not valid');

    await this.softRemove(activity);
    return Promise.resolve();
  };

  @methodTransformToDto(Activity)
  async createActivity(activity: Activity): Promise<ActivityEntity> {
    return this.save(activity);
  }

  @methodTransformToDto(Activity, true)
  async getCreatedActivities(
    organizer_id: number,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<ActivityEntity>> {
    const skip = getSkip(page);
    const [results, total] = await this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.location', 'location')
      .leftJoinAndSelect('activity.price', 'price')
      .where({ organizer_id })
      .andWhere('activity.datetime > :now', {
        now: new Date().toUTCString(),
      })
      .orderBy('activity.datetime', 'ASC')
      .skip(skip)
      .take(PAGE_SIZE)
      .getManyAndCount();

    return {
      page,
      results,
      total,
    };
  }

  @methodTransformToDto(Activity, true)
  async getJoinedActivities(
    user_id: number,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<ActivityEntity>> {
    const skip = getSkip(page);
    const [results, total] = await this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.location', 'location')
      .leftJoinAndSelect('activity.price', 'price')
      .leftJoin('activity.participants', 'participants')
      .where('participants.id = CAST(:user_id AS bigint)', { user_id })
      .andWhere((queryBuilder: SelectQueryBuilder<ActivityEntity>) => {
        const subQuery = queryBuilder
          .subQuery()
          .select('activity_id')
          .from(ParticipationEntity, 'participation')
          .where('participation.participant_id = CAST(:user_id AS bigint)', {
            user_id,
          })
          .getQuery();
        return `activity.id IN ${subQuery}`;
      })
      .andWhere('activity.deleted_at IS NULL')
      .andWhere('activity.datetime > :now', {
        now: new Date().toUTCString(),
      })
      .orderBy('activity.datetime', 'ASC')
      .skip(skip)
      .take(PAGE_SIZE)
      .getManyAndCount();

    return {
      page,
      results,
      total,
    };
  }

  @methodTransformToDto(Activity, true)
  async getUpcomingActivities(
    userLocation: UserLocation,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<ActivityEntity>> {
    const skip = getSkip(page);
    const [results, total] = await this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.location', 'location')
      .leftJoinAndSelect('activity.price', 'price')
      .where((queryBuilder: SelectQueryBuilder<ActivityEntity>) => {
        const subQuery = queryBuilder
          .subQuery()
          .select('activity_id')
          .from(ParticipationEntity, 'participation')
          .where('participation.participant_id = CAST(:user_id AS bigint)', {
            user_id: userLocation.userId,
          })
          .withDeleted()
          .getQuery();
        return `activity.id NOT IN ${subQuery}`;
      })
      .andWhere(
        'ST_Distance(ST_Point(location.longitude, location.latitude)::geography, ST_Point(:longitude, :latitude)::geography) < :distance',
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          distance: LOCATION_RADIUS_METERS,
        },
      )
      .andWhere('activity.remaining_vacancies > 0')
      .andWhere('activity.datetime > :now', {
        now: new Date().toUTCString(),
      })
      .orderBy('activity.datetime', 'ASC')
      .skip(skip)
      .take(PAGE_SIZE)
      .getManyAndCount();

    return {
      page,
      results,
      total,
    };
  }

  @methodTransformToDto(Activity)
  async resetRemainingVacancies(
    activity_id: string,
    organizer_id: number,
  ): Promise<ActivityEntity> {
    const activity = await this.createQueryBuilder('activity')
      .where('activity.id = CAST(:activity_id as uuid)', { activity_id })
      .andWhere('activity.organizer_id = CAST(:organizer_id AS bigint)', {
        organizer_id,
      })
      .andWhere('activity.datetime > :now', {
        now: new Date().toUTCString(),
      })
      .getOne();

    if (!activity) throw new Error('Activity is not valid');

    return this.save({
      ...activity,
      remaining_vacancies: 0,
    });
  }

  @methodTransformToDto(Activity)
  async subtractRemainingVacancies(
    activity_id: string,
    organizer_id?: number,
  ): Promise<ActivityEntity> {
    let queryBuilder = this.createQueryBuilder('activity')
      .where('activity.id = CAST(:activity_id AS uuid)', { activity_id })
      .andWhere('activity.remaining_vacancies > 0')
      .andWhere('activity.datetime > :now', {
        now: new Date().toUTCString(),
      });

    if (organizer_id) {
      queryBuilder = queryBuilder.andWhere(
        'activity.organizer_id = CAST(:organizer_id as bigint)',
        { organizer_id },
      );
    }

    const activity = await queryBuilder.getOne();
    if (!activity) throw new Error('Activity is not valid');

    return this.save({
      ...activity,
      remaining_vacancies: activity.remaining_vacancies - 1,
    });
  }
}
