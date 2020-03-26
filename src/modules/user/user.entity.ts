import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PasswordTransformer } from './transformers/password.transformer';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  facebook_id?: string;

  @Column({
    nullable: true,
  })
  google_id?: string;

  @Column()
  name: string;

  @Column({ default: '' })
  avatar?: string;

  @Column()
  email: string;

  @Column({
    transformer: new PasswordTransformer(),
    nullable: true,
  })
  password?: string;

  @Column()
  role: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
