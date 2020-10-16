import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CREATED_ACTIVITIES_PAYLOAD,
  GREETING_TEXT,
  INITIALIZE_ACTIVITY_PAYLOAD,
  JOINED_ACTIVITIES_PAYLOAD,
  PERSISTENT_MENU,
  UPCOMING_ACTIVITIES_PAYLOAD,
  UPDATE_LOCALE_PAYLOAD,
  UPDATE_LOCATION_TITLES,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { MessengerBotController } from 'modules/bots/messenger-bot/messenger-bot.controller';
import { BOOTBOT_OPTIONS_FACTORY } from 'modules/external/bootbot';

@Injectable()
export class MessengerBotService {
  constructor(
    @Inject(BOOTBOT_OPTIONS_FACTORY) private readonly bot,
    private readonly configService: ConfigService,
    private readonly controller: MessengerBotController,
  ) {}

  init(): void {
    const persistentMenu = PERSISTENT_MENU.map((menu) => {
      const updateLocationIndex = menu.call_to_actions.findIndex((button) =>
        UPDATE_LOCATION_TITLES.includes(button.title),
      );
      menu.call_to_actions[updateLocationIndex].url = `${this.configService.get(
        'EXTENSIONS_URL',
      )}/extensions/location`;

      return menu;
    });
    this.bot.setGreetingText(GREETING_TEXT);
    this.bot.setGetStartedButton(this.controller.getStartedButtonHandler);
    this.bot.setPersistentMenu(persistentMenu);

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
    this.bot.on(
      `postback:${UPDATE_LOCALE_PAYLOAD}`,
      this.controller.updateLocaleHandler,
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
