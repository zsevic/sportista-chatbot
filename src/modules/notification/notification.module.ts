import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipationRepository } from 'modules/participation/participation.repository';
import { UserModule } from 'modules/user/user.module';
import { NotificationService } from './notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParticipationRepository]), UserModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
