import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { PasswordTransformer } from './transformers/password.transformer';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({
    transformer: new PasswordTransformer(),
  })
  password: string;

  @Column()
  role: string;
}
