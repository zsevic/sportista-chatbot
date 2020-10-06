import { plainToClass } from 'class-transformer';
import {
  EntityRepository,
  MoreThan,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { FIRST_PAGE, PAGE_SIZE } from 'common/config/constants';
import { PaginatedResponse } from 'common/dtos';
import { getSkip } from 'common/utils';
import { ParticipationEntity } from 'modules/participation/participation.entity';
import { Activity } from './activity.dto';
import { ActivityEntity } from './activity.entity';

@EntityRepository(ActivityEntity)
export class ActivityRepository extends Repository<ActivityEntity> {
  addRemainingVacancies = async (
    activityId: string,
    organizerId?: number,
  ): Promise<Activity> => {
    const activity = await this.findOne({
      where: {
        id: activityId,
        ...(organizerId && { organizer_id: organizerId }),
      },
    });
    if (!activity) throw new Error('Activity is not valid');

    const updatedActivity = await this.save({
      ...activity,
      remaining_vacancies: activity.remaining_vacancies + 1,
    });

    return plainToClass(Activity, updatedActivity);
  };

  cancelActivity = async (id: string, organizer_id: number): Promise<void> => {
    const activity = await this.findOne({
      where: {
        id,
        organizer_id,
      },
    });
    if (!activity) throw new Error('Activity is not valid');

    await this.softRemove(activity);
    return Promise.resolve();
  };

  createActivity = async (activity: Activity): Promise<Activity> => {
    const newActivity = await this.save(activity);

    return plainToClass(Activity, newActivity);
  };

  getCreatedActivities = async (
    organizer_id: number,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<Activity>> => {
    const skip = getSkip(page);
    const [results, total] = await this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.location', 'location')
      .where({ organizer_id })
      .orderBy('activity.datetime', 'ASC')
      .skip(skip)
      .take(PAGE_SIZE)
      .getManyAndCount();

    return {
      page,
      results: plainToClass(Activity, results),
      total,
    };
  };

  getJoinedActivities = async (
    user_id: number,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<Activity>> => {
    const skip = getSkip(page);
    const [results, total] = await this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.location', 'location')
      .leftJoin('activity.participants', 'participants')
      .where('participants.id = CAST(:user_id AS bigint)', { user_id })
      .andWhere((qb: SelectQueryBuilder<ActivityEntity>) => {
        const subQuery = qb
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
      .orderBy('activity.datetime', 'ASC')
      .skip(skip)
      .take(PAGE_SIZE)
      .getManyAndCount();

    return {
      page,
      results: plainToClass(Activity, results),
      total,
    };
  };

  getUpcomingActivities = async (
    user_id: number,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<Activity>> => {
    const skip = getSkip(page);
    const [results, total] = await this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.location', 'location')
      .where((qb: SelectQueryBuilder<ActivityEntity>) => {
        const subQuery = qb
          .subQuery()
          .select('activity_id')
          .from(ParticipationEntity, 'participation')
          .where('participation.participant_id = CAST(:user_id AS bigint)', {
            user_id,
          })
          .withDeleted()
          .getQuery();
        return `activity.id NOT IN ${subQuery}`;
      })
      .andWhere('activity.remaining_vacancies > 0')
      .andWhere('activity.datetime > :now', {
        now: new Date().toDateString(),
      })
      .orderBy('activity.datetime', 'ASC')
      .skip(skip)
      .take(PAGE_SIZE)
      .getManyAndCount();

    return {
      page,
      results: plainToClass(Activity, results),
      total,
    };
  };

  resetRemainingVacancies = async (
    activityId: string,
    organizerId: number,
  ): Promise<Activity> => {
    const activity = await this.findOne({
      where: {
        id: activityId,
        organizer_id: organizerId,
      },
    });
    if (!activity) throw new Error('Activity is not valid');

    const updatedActivity = await this.save({
      ...activity,
      remaining_vacancies: 0,
    });

    return plainToClass(Activity, updatedActivity);
  };

  subtractRemainingVacancies = async (
    activityId: string,
    organizerId?: number,
  ): Promise<Activity> => {
    const activity = await this.findOne({
      where: {
        id: activityId,
        remaining_vacancies: MoreThan(0),
        ...(organizerId && { organizer_id: organizerId }),
      },
    });
    if (!activity) throw new Error('Activity is not valid');

    const updatedActivity = await this.save({
      ...activity,
      remaining_vacancies: activity.remaining_vacancies - 1,
    });

    return plainToClass(Activity, updatedActivity);
  };

  validateRemainingVacancies = async (activityId: string): Promise<void> => {
    const activity = await this.findOne({
      id: activityId,
      remaining_vacancies: MoreThan(0),
    });
    if (!activity) throw new Error('Remaining vacancies value is not valid');

    return Promise.resolve();
  };
}
