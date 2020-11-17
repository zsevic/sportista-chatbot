import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActivityEntity } from 'modules/activity/activity.entity';
import { FeedbackEntity } from 'modules/feedback/feedback.entity';
import { LocationEntity } from 'modules/location/location.entity';

@Entity('bot_user')
export class BotUserEntity {
  @PrimaryGeneratedColumn({
    type: 'uuid',
  })
  id: string;

  @Column({
    nullable: true,
    unique: true,
  })
  messenger_id?: string;

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

  @Column()
  is_subscribed: boolean;

  @Column({
    nullable: true,
  })
  timezone: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ActivityEntity, (activityEntity) => activityEntity.organizer)
  activities: ActivityEntity[];

  @OneToMany(() => FeedbackEntity, (feedbackEntity) => feedbackEntity.user)
  feedbacks: FeedbackEntity[];

  @ManyToOne(() => LocationEntity, (locationEntity) => locationEntity.users)
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;

  @ManyToMany(
    () => ActivityEntity,
    (activityEntity) => activityEntity.participants,
  )
  participations: ActivityEntity[];
}
