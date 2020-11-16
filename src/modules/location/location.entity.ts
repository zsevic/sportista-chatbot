import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActivityEntity } from 'modules/activity/activity.entity';
import { BotUserEntity } from 'modules/bot-user/user.entity';

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

  @Column()
  currency_code: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ActivityEntity, (activityEntity) => activityEntity.location)
  activities: ActivityEntity[];

  @OneToMany(() => BotUserEntity, (botUserEntity) => botUserEntity.location)
  users: BotUserEntity[];
}
