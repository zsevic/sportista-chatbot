import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityRepository } from 'modules/activity/activity.repository';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityRepository])],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
