import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityRepository } from 'modules/activity/activity.repository';
import { UserRepository } from 'modules/user/user.repository';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityRepository, UserRepository])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
