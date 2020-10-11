import {
  EntityRepository,
  MoreThan,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { FIRST_PAGE, PAGE_SIZE } from 'common/config/constants';
import { methodTransformToDto } from 'common/decorators';
import { PaginatedResponse } from 'common/dtos';
import { getSkip } from 'common/utils';
import { ParticipationEntity } from 'modules/participation/participation.entity';
import { Activity } from './activity.dto';
import { ActivityEntity } from './activity.entity';

@EntityRepository(ActivityEntity)
export class ActivityRepository extends Repository<ActivityEntity> {
  @methodTransformToDto(Activity)
  async addRemainingVacancies(
    activityId: string,
    organizerId?: number,
  ): Promise<ActivityEntity> {
    const activity = await this.findOne({
      where: {
        id: activityId,
        ...(organizerId && { organizer_id: organizerId }),
      },
    });
    if (!activity) throw new Error('Activity is not valid');

    return this.save({
      ...activity,
      remaining_vacancies: activity.remaining_vacancies + 1,
    });
  }

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
      results,
      total,
    };
  }

  @methodTransformToDto(Activity, true)
  async getUpcomingActivities(
    user_id: number,
    page = FIRST_PAGE,
  ): Promise<PaginatedResponse<ActivityEntity>> {
    const skip = getSkip(page);
    const [results, total] = await this.createQueryBuilder('activity')
      .leftJoinAndSelect('activity.location', 'location')
      .leftJoinAndSelect('activity.price', 'price')
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
      results,
      total,
    };
  }

  @methodTransformToDto(Activity)
  async resetRemainingVacancies(
    activityId: string,
    organizerId: number,
  ): Promise<ActivityEntity> {
    const activity = await this.findOne({
      where: {
        id: activityId,
        organizer_id: organizerId,
      },
    });
    if (!activity) throw new Error('Activity is not valid');

    return this.save({
      ...activity,
      remaining_vacancies: 0,
    });
  }

  @methodTransformToDto(Activity)
  async subtractRemainingVacancies(
    activityId: string,
    organizerId?: number,
  ): Promise<ActivityEntity> {
    const activity = await this.findOne({
      where: {
        id: activityId,
        remaining_vacancies: MoreThan(0),
        ...(organizerId && { organizer_id: organizerId }),
      },
    });
    if (!activity) throw new Error('Activity is not valid');

    return this.save({
      ...activity,
      remaining_vacancies: activity.remaining_vacancies - 1,
    });
  }

  validateRemainingVacancies = async (activityId: string): Promise<void> => {
    const activity = await this.findOne({
      id: activityId,
      remaining_vacancies: MoreThan(0),
    });
    if (!activity) throw new Error('Remaining vacancies value is not valid');

    return Promise.resolve();
  };
}
