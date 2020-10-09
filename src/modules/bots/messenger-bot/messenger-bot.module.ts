import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import BootBot from 'bootbot';
import config from 'common/config';
import { ActivityModule } from 'modules/activity/activity.module';
import { ParticipationModule } from 'modules/participation/participation.module';
import { StateModule } from 'modules/state/state.module';
import { UserModule } from 'modules/user/user.module';
import {
  CREATED_ACTIVITIES_PAYLOAD,
  INITIALIZE_ACTIVITY_PAYLOAD,
  JOINED_ACTIVITIES_PAYLOAD,
  PERSISTENT_MENU,
  UPCOMING_ACTIVITIES_PAYLOAD,
} from './messenger-bot.constants';
import { MessengerBotController } from './messenger-bot.controller';
import { GREETING_TEXT } from './messenger-bot.texts';
import {
  AttachmentService,
  MessageService,
  PostbackService,
  ResolverService,
  ResponseService,
} from './services';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
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
    PostbackService,
    ResolverService,
    ResponseService,
  ],
  exports: [MessengerBotController],
})
export class MessengerBotModule {
  instance;

  constructor(
    private readonly configService: ConfigService,
    private readonly controller: MessengerBotController,
  ) {
    this.init();
  }

  init() {
    this.instance = new BootBot({
      accessToken: this.configService.get('FB_PAGE_ACCESS_TOKEN'),
      verifyToken: this.configService.get('WEBHOOK_VERIFY_TOKEN'),
      appSecret: this.configService.get('FB_APP_SECRET'),
    });

    this.instance.setGreetingText(GREETING_TEXT);
    this.instance.setGetStartedButton(this.controller.getStartedButtonHandler);
    this.instance.setPersistentMenu(PERSISTENT_MENU);

    this.instance.on('attachment', this.controller.attachmentHandler);

    this.instance.on(
      `postback:${INITIALIZE_ACTIVITY_PAYLOAD}`,
      this.controller.initializeActivityHandler,
    );
    this.instance.on(
      `postback:${CREATED_ACTIVITIES_PAYLOAD}`,
      this.controller.createdActivitiesHandler,
    );
    this.instance.on(
      `postback:${JOINED_ACTIVITIES_PAYLOAD}`,
      this.controller.joinedActivitiesHandler,
    );
    this.instance.on(
      `postback:${UPCOMING_ACTIVITIES_PAYLOAD}`,
      this.controller.upcomingActivitiesHandler,
    );
    this.instance.on('postback', this.controller.postbackHandler);

    this.instance.on(
      `quick_reply:${INITIALIZE_ACTIVITY_PAYLOAD}`,
      this.controller.initializeActivityHandler,
    );
    this.instance.on(
      `quick_reply:${CREATED_ACTIVITIES_PAYLOAD}`,
      this.controller.createdActivitiesHandler,
    );
    this.instance.on(
      `quick_reply:${JOINED_ACTIVITIES_PAYLOAD}`,
      this.controller.joinedActivitiesHandler,
    );
    this.instance.on(
      `quick_reply:${UPCOMING_ACTIVITIES_PAYLOAD}`,
      this.controller.upcomingActivitiesHandler,
    );

    this.instance.on('message', this.controller.messageHandler);
  }
}
