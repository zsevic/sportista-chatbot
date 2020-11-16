import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from 'common/config';
import { ActivityModule } from 'modules/activity/activity.module';
import { FeedbackModule } from 'modules/feedback/feedback.module';
import { NotificationModule } from 'modules/notification/notification.module';
import { ParticipationModule } from 'modules/participation/participation.module';
import { BotUserModule } from 'modules/bot-user/user.module';
import { MessengerBotController } from './messenger-bot.controller';
import {
  LocationService,
  MessageService,
  MessengerBotService,
  PostbackService,
  ResolverService,
  ResponseService,
  ValidationService,
} from './services';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    ActivityModule,
    FeedbackModule,
    NotificationModule,
    ParticipationModule,
    BotUserModule,
  ],
  controllers: [MessengerBotController],
  providers: [
    LocationService,
    MessageService,
    MessengerBotController,
    MessengerBotService,
    PostbackService,
    ResolverService,
    ResponseService,
    ValidationService,
  ],
  exports: [MessengerBotService],
})
export class MessengerBotModule {}
