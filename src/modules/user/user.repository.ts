import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { ActivityEntity } from 'modules/activity/activity.entity';
import { ParticipationEntity } from 'modules/participation/participation.entity';
import { User } from './user.dto';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  getParticipantListByActivity = async (
    activity_id: string,
  ): Promise<User[]> => {
    const participantList = await this.createQueryBuilder('user')
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

    return plainToClass(User, participantList);
  };

  getUser = async (id: number): Promise<User> => {
    const user = await this.findOne(id);
    if (!user) throw new Error("User doesn't exist");

    return plainToClass(User, user);
  };

  registerUser = async (userDto: User): Promise<User> => {
    const user = await this.findOne(userDto.id);
    if (user) return plainToClass(User, user);

    const newUser = await this.save(userDto);
    return plainToClass(User, newUser);
  };
}
