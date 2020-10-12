import { Inject, Injectable } from '@nestjs/common';
import {
  CREATED_ACTIVITIES_PAYLOAD,
  INITIALIZE_ACTIVITY_PAYLOAD,
  JOINED_ACTIVITIES_PAYLOAD,
  PERSISTENT_MENU,
  UPCOMING_ACTIVITIES_PAYLOAD,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { MessengerBotController } from 'modules/bots/messenger-bot/messenger-bot.controller';
import { GREETING_TEXT } from 'modules/bots/messenger-bot/messenger-bot.constants';
import { BOOTBOT_OPTIONS_FACTORY } from 'modules/external/bootbot';

@Injectable()
export class MessengerBotService {
  constructor(
    @Inject(BOOTBOT_OPTIONS_FACTORY) private readonly bot,
    private readonly controller: MessengerBotController,
  ) {}

  init(): void {
    this.bot.setGreetingText(GREETING_TEXT);
    this.bot.setGetStartedButton(this.controller.getStartedButtonHandler);
    this.bot.setPersistentMenu(PERSISTENT_MENU);

    this.bot.on('attachment', this.controller.attachmentHandler);

    this.bot.on(
      `postback:${INITIALIZE_ACTIVITY_PAYLOAD}`,
      this.controller.initializeActivityHandler,
    );
    this.bot.on(
      `postback:${CREATED_ACTIVITIES_PAYLOAD}`,
      this.controller.createdActivitiesHandler,
    );
    this.bot.on(
      `postback:${JOINED_ACTIVITIES_PAYLOAD}`,
      this.controller.joinedActivitiesHandler,
    );
    this.bot.on(
      `postback:${UPCOMING_ACTIVITIES_PAYLOAD}`,
      this.controller.upcomingActivitiesHandler,
    );
    this.bot.on('postback', this.controller.postbackHandler);

    this.bot.on(
      `quick_reply:${INITIALIZE_ACTIVITY_PAYLOAD}`,
      this.controller.initializeActivityHandler,
    );
    this.bot.on(
      `quick_reply:${CREATED_ACTIVITIES_PAYLOAD}`,
      this.controller.createdActivitiesHandler,
    );
    this.bot.on(
      `quick_reply:${JOINED_ACTIVITIES_PAYLOAD}`,
      this.controller.joinedActivitiesHandler,
    );
    this.bot.on(
      `quick_reply:${UPCOMING_ACTIVITIES_PAYLOAD}`,
      this.controller.upcomingActivitiesHandler,
    );

    this.bot.on('message', this.controller.messageHandler);
  }
}
