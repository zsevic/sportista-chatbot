import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActivityEntity } from 'modules/activity/activity.entity';
import { LocationEntity } from 'modules/location/location.entity';
import { StateEntity } from 'modules/state/state.entity';

@Entity('user')
export class UserEntity {
  @PrimaryColumn({
    type: 'bigint',
  })
  id: number;

  @Column({ nullable: true, type: 'uuid' })
  location_id?: string;

  @Column()
  first_name: string;

  @Column()
  gender: string;

  @Column()
  image_url: string;

  @Column()
  last_name: string;

  @Column()
  locale: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ActivityEntity, (activityEntity) => activityEntity.organizer)
  activities: ActivityEntity[];

  @ManyToOne(() => LocationEntity, (locationEntity) => locationEntity.users)
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;

  @ManyToMany(
    () => ActivityEntity,
    (activityEntity) => activityEntity.participants,
  )
  participations: ActivityEntity[];

  @OneToOne(() => StateEntity, (stateEntity) => stateEntity.user)
  state: StateEntity;
}
