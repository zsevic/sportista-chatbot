import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipationRepository } from 'modules/participation/participation.repository';
import { BotUserModule } from 'modules/bot-user/user.module';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParticipationRepository]), BotUserModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
