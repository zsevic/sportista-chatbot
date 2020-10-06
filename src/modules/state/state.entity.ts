import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'modules/user/user.entity';

@Entity('state')
export class StateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'bigint',
  })
  user_id: number;

  @Column({
    nullable: true,
  })
  current_state: string;

  @Column({
    nullable: true,
  })
  activity_type: string;

  @Column({
    nullable: true,
  })
  datetime: Date;

  @Column({
    nullable: true,
  })
  location_title: string;

  @Column({
    nullable: true,
    type: 'decimal',
  })
  location_latitude: number;

  @Column({
    nullable: true,
    type: 'decimal',
  })
  location_longitude: number;

  @Column({
    nullable: true,
  })
  price_value: number;

  @Column({
    nullable: true,
    type: 'int',
  })
  remaining_vacancies: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => UserEntity, (userEntity) => userEntity.state)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
