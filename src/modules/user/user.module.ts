import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationModule } from 'modules/location/location.module';
import { StateRepository } from 'modules/state/state.repository';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([StateRepository, UserRepository]),
    LocationModule,
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
