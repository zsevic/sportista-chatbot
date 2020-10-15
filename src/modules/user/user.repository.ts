import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { classTransformToDto } from 'common/decorators';
import { ActivityEntity } from 'modules/activity/activity.entity';
import { ParticipationEntity } from 'modules/participation/participation.entity';
import { User } from './user.dto';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
@classTransformToDto(User)
export class UserRepository extends Repository<UserEntity> {
  async createLocation(
    userId: number,
    location_id: string,
  ): Promise<UserEntity> {
    const user = await this.findOne(userId);
    if (!user) throw new Error("User doesn't exist");

    return this.save({
      ...user,
      location_id,
    });
  }

  async getParticipantListByActivity(
    activity_id: string,
  ): Promise<UserEntity[]> {
    return this.createQueryBuilder('user')
      .leftJoin('user.participations', 'participations')
      .where((qb: SelectQueryBuilder<ActivityEntity>) => {
        const subQuery = qb
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
}
