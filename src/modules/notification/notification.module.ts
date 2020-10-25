import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityRepository } from 'modules/activity/activity.repository';
import { UserModule } from 'modules/user/user.module';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityRepository]), UserModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
