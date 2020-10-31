import { Inject, Injectable } from '@nestjs/common';
import {
  GET_STARTED_PAYLOAD,
  GREETING_TEXT,
  PERSISTENT_MENU,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { MessengerBotController } from 'modules/bots/messenger-bot/messenger-bot.controller';
import { BOOTBOT_OPTIONS_FACTORY } from 'modules/external/bootbot';
import { UserService } from 'modules/user/user.service';
import { ResponseService } from './response.service';

@Injectable()
export class MessengerBotService {
  constructor(
    @Inject(BOOTBOT_OPTIONS_FACTORY) private readonly bot,
    private readonly controller: MessengerBotController,
    private readonly responseService: ResponseService,
    private readonly userService: UserService,
  ) {}

  private asyncWrap = (fn) => async (payload, chat) => {
    const user = await this.userService.validateUser(payload.sender.id);

    if (!user && payload?.postback?.payload !== GET_STARTED_PAYLOAD) {
      const { locale } = await chat.getUserProfile();
      if (!locale) return;

      const response = await this.responseService.getRegisterUserFailureResponse(
        locale,
      );
      return chat.say(response);
    }

    await fn(payload, chat);
  };

  init = (): void => {
    this.bot.setGreetingText(GREETING_TEXT);
    this.bot.setPersistentMenu(PERSISTENT_MENU);

    this.bot.on(
      'attachment',
      this.asyncWrap(this.controller.attachmentHandler),
    );

    this.bot.on('message', this.asyncWrap(this.controller.messageHandler));

    this.bot.on('postback', this.asyncWrap(this.controller.postbackHandler));
  };
}
