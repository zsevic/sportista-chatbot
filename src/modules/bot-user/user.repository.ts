import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { LOCATION_RADIUS_METERS } from 'common/config/constants';
import { UserLocation } from 'common/dtos';
import { ActivityEntity } from 'modules/activity/activity.entity';
import { ParticipationEntity } from 'modules/participation/participation.entity';
import { PARTICIPATION_STATUS } from 'modules/participation/participation.enums';
import { BotUser } from './user.dto';
import { BotUserEntity } from './user.entity';
import { BotUserOptions } from './user.types';

@EntityRepository(BotUserEntity)
export class BotUserRepository extends Repository<BotUserEntity> {
  async getLocation(userOptions: BotUserOptions): Promise<UserLocation> {
    const { id: userId, location } = await this.findOne({
      where: userOptions,
      relations: ['location'],
    });
    if (!location) throw new Error("User's location is not set");

    const userLocation: UserLocation = {
      latitude: +location.latitude,
      longitude: +location.longitude,
      userId,
    };

    return userLocation;
  }

  async getParticipantListByActivity(activityId: string): Promise<BotUser[]> {
    return this.createQueryBuilder('user')
      .leftJoin('user.participations', 'participations')
      .where((queryBuilder: SelectQueryBuilder<ActivityEntity>) => {
        const subQuery = queryBuilder
          .subQuery()
          .select('activity_id')
          .from(ParticipationEntity, 'participation')
          .where('participation.activity_id = CAST(:activityId AS uuid)', {
            activityId,
          })
          .andWhere('participation.status = :status', {
            status: PARTICIPATION_STATUS.ACCEPTED,
          })
          .getQuery();
        return `participations.id IN ${subQuery}`;
      })
      .andWhere('participations.deleted_at IS NULL')
      .getMany();
  }

  getSubscribedUsersNearby = async (latitude: number, longitude: number) =>
    this.createQueryBuilder('user')
      .leftJoinAndSelect('user.location', 'location')
      .where('user.is_subscribed = :isSubscribed', { isSubscribed: true })
      .andWhere(
        'ST_Distance(ST_Point(location.longitude, location.latitude)::geography, ST_Point(:longitude, :latitude)::geography) < :distance',
        {
          latitude,
          longitude,
          distance: LOCATION_RADIUS_METERS,
        },
      )
      .getMany();

  async getUser(userOptions: BotUserOptions): Promise<BotUser> {
    const user = await this.findOne({ where: userOptions });
    if (!user) throw new Error("User doesn't exist");

    return user;
  }

  async registerUser(
    userDto: BotUser,
    userOptions: BotUserOptions,
  ): Promise<BotUser> {
    const user = await this.findOne({ where: userOptions });
    if (!user) return this.save(userDto);

    return user;
  }

  async subscribeToNotifications(
    userOptions: BotUserOptions,
  ): Promise<BotUser> {
    const user = await this.findOne({ where: userOptions });
    if (!user) throw new Error("User doesn't exist");

    return this.save({
      ...user,
      is_subscribed: true,
    });
  }

  async unsubscribeToNotifications(
    userOptions: BotUserOptions,
  ): Promise<BotUser> {
    const user = await this.findOne({ where: userOptions });
    if (!user) throw new Error("User doesn't exist");

    return this.save({
      ...user,
      is_subscribed: false,
    });
  }

  async upsertLocation(
    userOptions: BotUserOptions,
    location_id: string,
  ): Promise<BotUser> {
    const user = await this.findOne({ where: userOptions });
    if (!user) throw new Error("User doesn't exist");

    if (user.location_id === location_id) return user;

    return this.save({
      ...user,
      location_id,
    });
  }

  async upsertTimezone(
    userOptions: BotUserOptions,
    timezone: string,
  ): Promise<BotUser> {
    const user = await this.findOne({ where: userOptions });
    if (!user) throw new Error("User doesn't exist");

    if (user.timezone === timezone) return user;

    return this.save({
      ...user,
      timezone,
    });
  }

  async validateActivityLocation(
    userOptions: BotUserOptions,
    latitude: number,
    longitude: number,
  ): Promise<BotUser> {
    const [platformIdKey] = Object.keys(userOptions);
    const user = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.location', 'location')
      .where(`user.${platformIdKey} = :${platformIdKey}`, userOptions)
      .andWhere(
        'ST_Distance(ST_Point(location.longitude, location.latitude)::geography, ST_Point(:longitude, :latitude)::geography) < :distance',
        {
          latitude,
          longitude,
          distance: LOCATION_RADIUS_METERS,
        },
      )
      .getOne();
    if (!user) return;

    return user;
  }

  async validateUser(userOptions: BotUserOptions): Promise<BotUser> {
    const user = await this.findOne({ where: userOptions });
    if (!user) return;

    return user;
  }
}
