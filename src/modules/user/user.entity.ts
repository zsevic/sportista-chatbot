import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActivityEntity } from 'modules/activity/activity.entity';
import { StateEntity } from 'modules/state/state.entity';

@Entity('user')
export class UserEntity {
  @PrimaryColumn({
    type: 'bigint',
  })
  id: number;

  @Column()
  first_name: string;

  @Column()
  gender: string;

  @Column()
  image_url: string;

  @Column()
  last_name: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    () => ActivityEntity,
    activityEntity => activityEntity.organizer,
  )
  activities: ActivityEntity[];

  @OneToOne(
    () => StateEntity,
    stateEntity => stateEntity.user,
  )
  state: StateEntity;

  @ManyToMany(
    () => ActivityEntity,
    activityEntity => activityEntity.participants,
  )
  participations: ActivityEntity[];
}
