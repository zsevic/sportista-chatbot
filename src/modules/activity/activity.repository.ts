import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import {
  FIRST_PAGE,
  LOCATION_RADIUS_METERS,
  PAGE_SIZE,
} from 'common/config/constants';
import { PaginatedResponse, UserLocation } from 'common/dtos';
import { getSkip } from 'common/utils';
import { ParticipationEntity } from 'modules/participation/participation.entity';
import { PARTICIPATION_STATUS } from 'modules/participation/participation.enums';
import { Activity } from './activity.dto';
import { ActivityEntity } from './activity.entity';
import { BotUserOptions } from 'modules/bot-user/user.types';

@EntityRepository(ActivityEntity)
export class ActivityRepository extends Repository<ActivityEntity> {
  async addRemainingVacancies(
    activityId: string,
    organizerOptions?: BotUserOptions,
  ): Promise<ActivityEntity> {
    let queryBuilder = this.createQueryBuilder('activity');

    if (organizerOptions) {
      const [platformIdKey] = Object.keys(organizerOptions);
      queryBuilder = queryBuilder
        .leftJoinAndSelect('activity.organizer', 'organizer')
        .where(
          `organizer.${platformIdKey} = :${platformIdKey}`,
          organizerOptions,
        );
    }
    queryBuilder = queryBuilder
      .where('activity.id = CAST(:activityId AS uuid)', { activityId })
      .andWhere('activity.datetime > :now', {
        now: new Date().toUTCString(),
      });

    const activity = await queryBuilder.getOne();
    if (!activity) throw new Error('Activity is not valid');

    return this.save({
      ...activity,
      remaining_vacancies: activity.remaining_vacancies + 1,
    });
  }

  cancelActivity = async (
    id: string,
    organizerOptions: BotUserOptions,
  ): Promise<void> => {
    const [platformIdKey] = Object.keys(organizerOptions);
    const activity = await this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.organizer', 'organizer')
      .where('activity.id = CAST(:id AS uuid)', { id })
      .andWhere(
        `organizer.${platformIdKey} = :${platformIdKey}`,
        organizerOptions,
      )
      .andWhere('activity.datetime > :now', {
        now: new Date().toUTCString(),
      })
      .getOne();

    if (!activity) throw new Error('Activity is not valid');

    await this.softRemove(activity);
    return Promise.resolve();
  };

  async createActivity(activity: Activity): Promise<ActivityEntity> {
    return this.save(activity);
  }

  async getCreatedActivities(
    organizerOptions: BotUserOptions,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<ActivityEntity>> {
    const skip = getSkip(page);
    const [platformIdKey] = Object.keys(organizerOptions);

    const [results, total] = await this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.location', 'location')
      .leftJoinAndSelect('activity.price', 'price')
      .leftJoinAndSelect('activity.organizer', 'organizer')
      .where(`organizer.${platformIdKey} = :${platformIdKey}`, organizerOptions)
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

  async getJoinedActivities(
    userId: string,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<ActivityEntity>> {
    const skip = getSkip(page);
    const [results, total] = await this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.location', 'location')
      .leftJoinAndSelect('activity.price', 'price')
      .leftJoinAndSelect('activity.participants', 'participants')
      .where(`participants.id = CAST(:userId AS uuid)`, {
        userId,
      })
      .andWhere((queryBuilder: SelectQueryBuilder<ActivityEntity>) => {
        const subQuery = queryBuilder
          .subQuery()
          .select('activity_id')
          .from(ParticipationEntity, 'participation')
          .where('participation.participant_id = CAST(:userId AS uuid)', {
            userId,
          })
          .andWhere('participation.status = :status', {
            status: PARTICIPATION_STATUS.ACCEPTED,
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

  async getUpcomingActivities(
    userLocation: UserLocation,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<ActivityEntity>> {
    const skip = getSkip(page);
    const { userId } = userLocation;
    const [results, total] = await this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.location', 'location')
      .leftJoinAndSelect('activity.price', 'price')
      .where((queryBuilder: SelectQueryBuilder<ActivityEntity>) => {
        const subQuery = queryBuilder
          .subQuery()
          .select('activity_id')
          .from(ParticipationEntity, 'participation')
          .where('participation.participant_id = CAST(:userId AS uuid)', {
            userId,
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

  async resetRemainingVacancies(
    activityId: string,
    organizerOptions: BotUserOptions,
  ): Promise<ActivityEntity> {
    const [platformIdKey] = Object.keys(organizerOptions);
    const activity = await this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.organizer', 'organizer')
      .where('activity.id = CAST(:activityId AS uuid)', { activityId })
      .andWhere(
        `organizer.${platformIdKey} = :${platformIdKey}`,
        organizerOptions,
      )
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

  async subtractRemainingVacancies(
    activityId: string,
    organizerOptions?: BotUserOptions,
  ): Promise<ActivityEntity> {
    let queryBuilder = this.createQueryBuilder('activity');
    if (organizerOptions) {
      const [platformIdKey] = Object.keys(organizerOptions);
      queryBuilder = queryBuilder
        .leftJoinAndSelect('activity.organizer', 'organizer')
        .andWhere(
          `organizer.${platformIdKey} = :${platformIdKey}`,
          organizerOptions,
        );
    }

    queryBuilder = queryBuilder
      .where('activity.id = CAST(:activityId AS uuid)', { activityId })
      .andWhere('activity.remaining_vacancies > 0')
      .andWhere('activity.datetime > :now', {
        now: new Date().toUTCString(),
      });

    const activity = await queryBuilder.getOne();
    if (!activity) throw new Error('Activity is not valid');

    return this.save({
      ...activity,
      remaining_vacancies: activity.remaining_vacancies - 1,
    });
  }
}
