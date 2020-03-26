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
    const user = await this.findOne({
      select: ['id', 'avatar', 'email', 'name', 'role'],
      where: { email },
    });

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

  async createUser(profile: any): Promise<User> {
    const provider_id = `${profile.provider}_id`;
    const newUser = await this.save({
      [provider_id]: profile.id,
      avatar: profile.picture,
      email: profile.email,
      name: profile.displayName,
      role: AppRoles.USER,
    });
    const user = {
      id: newUser.id,
      avatar: newUser.avatar,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    return plainToClass(User, user);
  }

  async validate(name: string, email: string): Promise<void> {
    const qb = await this.createQueryBuilder('user')
      .where('user.name = :name', { name })
      .orWhere('user.email = :email', { email });

    const user = await qb.getOne();
    if (user) {
      throw new BadRequestException('Name and email must be unique');
    }
  }

  async register(payload: RegisterUserDto) {
    const newUser = new UserEntity();
    newUser.email = payload.email;
    newUser.name = payload.name;
    newUser.password = payload.password;
    newUser.role = AppRoles.USER;

    const savedUser = await this.save(newUser);

    return plainToClass(User, savedUser);
  }
}
