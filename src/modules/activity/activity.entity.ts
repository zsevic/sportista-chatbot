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
import { LocationEntity } from 'modules/location/location.entity';
import { UserEntity } from 'modules/user/user.entity';
import { PriceEntity } from './price/price.entity';

@Entity('activity')
export class ActivityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'bigint',
  })
  organizer_id: number;

  @Column()
  datetime: string;

  @Column({
    type: 'uuid',
  })
  location_id: string;

  @Column({
    type: 'uuid',
  })
  price_id: string;

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

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.activities)
  @JoinColumn({ name: 'organizer_id' })
  organizer: UserEntity;

  @ManyToMany(() => UserEntity, (userEntity) => userEntity.participations)
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

  @ManyToOne(
    () => LocationEntity,
    (locationEntity) => locationEntity.activities,
  )
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;

  @ManyToOne(() => PriceEntity, (priceEntity) => priceEntity.activities)
  @JoinColumn({ name: 'price_id' })
  price: PriceEntity;
}
