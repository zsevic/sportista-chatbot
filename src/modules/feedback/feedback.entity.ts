import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from 'modules/user/user.entity';

@Entity('feedback')
export class FeedbackEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'bigint',
  })
  user_id: number;

  @Column()
  text: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.feedbacks)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
