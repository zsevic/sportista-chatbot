import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GET_STARTED_PAYLOAD,
  GREETING_TEXT,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { MessengerBotController } from 'modules/bots/messenger-bot/messenger-bot.controller';
import { BOOTBOT_OPTIONS_FACTORY } from 'modules/external/bootbot';
import { UserService } from 'modules/user/user.service';
import { ResponseService } from './response.service';

@Injectable()
export class MessengerBotService {
  constructor(
    @Inject(BOOTBOT_OPTIONS_FACTORY) private readonly bot,
    private readonly configService: ConfigService,
    private readonly controller: MessengerBotController,
    private readonly responseService: ResponseService,
    private readonly userService: UserService,
  ) {}

  asyncWrap = (fn) => async (payload, chat) => {
    const user = await this.userService.validateUser(payload.sender.id);

    if (!user && payload?.postback?.payload !== GET_STARTED_PAYLOAD) {
      const { locale } = await chat.getUserProfile();
      const response = await this.responseService.getRegisterUserFailureResponse(
        locale,
      );
      return chat.say(response);
    }

    await fn(payload, chat);
  };

  init = (): void => {
    const persistentMenu = this.configService.get('persistentMenu');
    this.bot.setGreetingText(GREETING_TEXT);
    this.bot.setPersistentMenu(persistentMenu);

    this.bot.on(
      'attachment',
      this.asyncWrap(this.controller.attachmentHandler),
    );

    this.bot.on('postback', this.asyncWrap(this.controller.postbackHandler));

    // this.bot.on(
    //   `quick_reply:${CREATED_ACTIVITIES_PAYLOAD}`,
    //   this.controller.createdActivitiesHandler,
    // );
    // this.bot.on(
    //   `quick_reply:${INITIALIZE_ACTIVITY_PAYLOAD}`,
    //   this.controller.initializeActivityHandler,
    // );
    // this.bot.on(
    //   `quick_reply:${JOINED_ACTIVITIES_PAYLOAD}`,
    //   this.controller.joinedActivitiesHandler,
    // );
    // this.bot.on(
    //   `quick_reply:${UPCOMING_ACTIVITIES_PAYLOAD}`,
    //   this.controller.upcomingActivitiesHandler,
    // );

    this.bot.on('message', this.asyncWrap(this.controller.messageHandler));
  };
}
