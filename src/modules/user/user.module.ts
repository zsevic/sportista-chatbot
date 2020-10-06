import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateRepository } from 'modules/state/state.repository';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StateRepository, UserRepository])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
