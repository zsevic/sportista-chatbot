import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ActivityEntity } from 'modules/activity/activity.entity';
import { BotUserEntity } from 'modules/bot-user/user.entity';
import { PARTICIPATION_STATUS } from './participation.enums';

@Entity('participation')
@Unique(['activity_id', 'participant_id'])
export class ParticipationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
  })
  activity_id: string;

  @Column({
    type: 'bigint',
  })
  participant_id: number;

  @Column()
  status: PARTICIPATION_STATUS;

  @CreateDateColumn()
  created_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(
    () => ActivityEntity,
    (activityEntity) => activityEntity.participants,
  )
  @JoinColumn({ name: 'activity_id' })
  activity: ActivityEntity;

  @ManyToOne(
    () => BotUserEntity,
    (botUserEntity) => botUserEntity.participations,
  )
  @JoinColumn({ name: 'participant_id' })
  participant: BotUserEntity;
}
