import * as crypto from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EntityRepository, Repository } from 'typeorm';
import { AppRoles } from 'modules/auth/roles/roles.enum';
import { RegisterUserDto } from './dto';
import { UserEntity } from './user.entity';
import { User } from './user.payload';

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

  async findOrCreate(profile: any): Promise<User> {
    let user = await this.findOne({
      email: profile.emails[0].value,
    });
    if (!user) {
      user = await this.save({
        [`${profile.provider}_id`]: profile.id,
        username: profile.displayName,
        email: profile.emails?.[0].value || '',
        // avatar: profile.photos?.[0].value || '',
        role: AppRoles.USER,
      });
    }

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
