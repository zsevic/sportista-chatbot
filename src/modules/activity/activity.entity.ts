import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from 'modules/user/user.entity';

@Entity('activity')
export class ActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'bigint',
  })
  organizer_id: number;

  @Column()
  datetime: Date;

  @Column()
  location_title: string;

  @Column({
    type: 'decimal',
  })
  location_latitude: number;

  @Column({
    type: 'decimal',
  })
  location_longitude: number;

  @Column()
  price: number;

  @Column({
    type: 'int',
  })
  remaining_vacancies: number;

  @Column()
  type: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(
    () => UserEntity,
    userEntity => userEntity.activities,
  )
  @JoinColumn({ name: 'organizer_id' })
  organizer: UserEntity;

  @ManyToMany(
    () => UserEntity,
    userEntity => userEntity.participations,
  )
  @JoinTable({
    name: 'participation',
    joinColumn: {
      name: 'activity_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'participant_id',
      referencedColumnName: 'id',
    },
  })
  participants: UserEntity[];
}
