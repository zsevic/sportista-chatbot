import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActivityEntity } from 'modules/activity/activity.entity';
import { UserEntity } from 'modules/user/user.entity';

@Entity('location')
export class LocationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ActivityEntity, (activityEntity) => activityEntity.location)
  activities: ActivityEntity[];

  @OneToMany(() => UserEntity, (userEntity) => userEntity.location)
  users: UserEntity[];
}