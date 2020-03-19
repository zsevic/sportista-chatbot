import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto';
import { User } from './user.payload';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async get(id: string): Promise<User> {
    return this.userRepository.get(id);
  }

  async getByEmail(email: string): Promise<User> {
    return this.userRepository.getByEmail(email);
  }

  async getByEmailAndPassword(email: string, password: string): Promise<User> {
    return this.userRepository.getByEmailAndPassword(email, password);
  }

  async findOrCreate(profile: any): Promise<User> {
    return this.userRepository.findOrCreate(profile);
  }

  async register(payload: RegisterUserDto): Promise<User> {
    await this.userRepository.validate(payload.username, payload.email);

    return this.userRepository.register(payload);
  }
}
