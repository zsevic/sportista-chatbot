import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from 'common/config';
import { ActivityModule } from 'modules/activity/activity.module';
import messengerBotConfig from 'modules/bots/messenger-bot/messenger-bot.config';
import { ParticipationModule } from 'modules/participation/participation.module';
import { StateModule } from 'modules/state/state.module';
import { UserModule } from 'modules/user/user.module';
import { MessengerBotController } from './messenger-bot.controller';
import {
  AttachmentService,
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
      load: [config, messengerBotConfig],
    }),
    ActivityModule,
    ParticipationModule,
    StateModule,
    UserModule,
  ],
  controllers: [MessengerBotController],
  providers: [
    AttachmentService,
    MessageService,
    MessengerBotController,
    MessengerBotService,
    PostbackService,
    ResolverService,
    ResponseService,
    ValidationService,
  ],
  exports: [MessengerBotController, MessengerBotService],
})
export class MessengerBotModule {}
