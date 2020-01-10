import { NotAcceptableException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import * as crypto from 'crypto';
import { UserEntity } from './user.entity';
import { User } from './user.payload';
import { RegisterUserDto } from './dto';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async get(id: string): Promise<User> {
    const user = await this.findOne(id);

    return plainToClass(User, user);
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.createQueryBuilder('user')
      .where('user.email = :email')
      .setParameter('email', email)
      .getOne();

    return plainToClass(User, user);
  }

  async getByEmailAndPassword(email: string, password: string): Promise<User> {
    const passwordHash = crypto.createHmac('sha256', password).digest('hex');

    const user = await this.createQueryBuilder('user')
      .where('user.email = :email and user.password = :password')
      .setParameter('email', email)
      .setParameter('password', passwordHash)
      .getOne();

    return plainToClass(User, user);
  }

  async register(payload: RegisterUserDto) {
    const user = await this.getByEmail(payload.email);
    if (user) {
      throw new NotAcceptableException('User with provided email is already created');
    }

    const newUser = new UserEntity();
    newUser.email = payload.email;
    newUser.username = payload.username;
    newUser.password = payload.password;
    newUser.role = payload.role;

    const savedUser = await this.save(newUser);

    return plainToClass(User, savedUser);
  }
}
