import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import {
  I18N_FALLBACKS,
  LOCATION_RADIUS_METERS,
} from 'common/config/constants';
import { classTransformToDto } from 'common/decorators';
import { UserLocation } from 'common/dtos';
import { ActivityEntity } from 'modules/activity/activity.entity';
import { ParticipationEntity } from 'modules/participation/participation.entity';
import { User } from './user.dto';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
@classTransformToDto(User)
export class UserRepository extends Repository<UserEntity> {
  async getLocation(userId: number): Promise<UserLocation> {
    const { location } = await this.findOne(userId, {
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

  async getParticipantListByActivity(
    activity_id: string,
  ): Promise<UserEntity[]> {
    return this.createQueryBuilder('user')
      .leftJoin('user.participations', 'participations')
      .where((queryBuilder: SelectQueryBuilder<ActivityEntity>) => {
        const subQuery = queryBuilder
          .subQuery()
          .select('activity_id')
          .from(ParticipationEntity, 'participation')
          .where('participation.activity_id = CAST(:activity_id AS uuid)', {
            activity_id,
          })
          .getQuery();
        return `participations.id IN ${subQuery}`;
      })
      .andWhere('participations.deleted_at IS NULL')
      .getMany();
  }

  async getUser(id: number): Promise<UserEntity> {
    const user = await this.findOne(id);
    if (!user) throw new Error("User doesn't exist");

    return user;
  }

  async registerUser(userDto: User): Promise<UserEntity> {
    const user = await this.findOne(userDto.id);
    if (!user) return this.save(userDto);

    return user;
  }

  async updateLocale(userId: number, locale: string): Promise<UserEntity> {
    const user = await this.findOne(userId);
    const isUpdated =
      user &&
      user.locale !== locale &&
      Object.keys(I18N_FALLBACKS).includes(locale);
    if (!isUpdated) throw new Error('Update failed');

    return this.save({
      ...user,
      locale,
    });
  }

  async upsertLocation(
    userId: number,
    location_id: string,
  ): Promise<UserEntity> {
    const user = await this.findOne(userId);
    if (!user) throw new Error("User doesn't exist");

    if (user.location_id === location_id) return user;

    return this.save({
      ...user,
      location_id,
    });
  }

  async upsertTimezone(userId: number, timezone: string): Promise<UserEntity> {
    const user = await this.findOne(userId);
    if (!user) throw new Error("User doesn't exist");

    if (user.timezone === timezone) return user;

    return this.save({
      ...user,
      timezone,
    });
  }

  async validateActivityLocation(
    userId: number,
    latitude: number,
    longitude: number,
  ): Promise<boolean> {
    const user = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.location', 'location')
      .where('user.id = CAST(:user_id AS bigint)', { user_id: userId })
      .andWhere(
        'ST_Distance(ST_Point(location.longitude, location.latitude)::geography, ST_Point(:longitude, :latitude)::geography) < :distance',
        {
          latitude,
          longitude,
          distance: LOCATION_RADIUS_METERS,
        },
      )
      .getOne();
    if (!user) return false;

    return true;
  }

  async validateUser(id: number): Promise<User> {
    const user = await this.findOne(id);
    if (!user) return;

    return user;
  }
}
