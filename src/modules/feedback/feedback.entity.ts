import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BotUserEntity } from 'modules/bot-user/user.entity';

@Entity('feedback')
export class FeedbackEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
  })
  user_id: string;

  @Column()
  text: string;

  @ManyToOne(() => BotUserEntity, (botUserEntity) => botUserEntity.feedbacks)
  @JoinColumn({ name: 'user_id' })
  user: BotUserEntity;
}
