import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationModule } from 'modules/location/location.module';
import { BotUserService } from './user.service';
import { BotUserRepository } from './user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BotUserRepository]), LocationModule],
  providers: [BotUserService],
  exports: [BotUserService],
})
export class BotUserModule {}
