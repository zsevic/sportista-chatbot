import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { AppRoles } from 'modules/auth/roles/roles.enum';
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

  async validate(username: string, email: string): Promise<void> {
    const qb = await this.createQueryBuilder('user')
      .where('user.username = :username', { username })
      .orWhere('user.email = :email', { email });

    const user = await qb.getOne();
    if (user) {
      throw new BadRequestException('Username and email must be unique');
    }
  }

  async register(payload: RegisterUserDto) {
    const newUser = new UserEntity();
    newUser.email = payload.email;
    newUser.username = payload.username;
    newUser.password = payload.password;
    newUser.role = AppRoles.USER;

    const savedUser = await this.save(newUser);

    return plainToClass(User, savedUser);
  }
}
