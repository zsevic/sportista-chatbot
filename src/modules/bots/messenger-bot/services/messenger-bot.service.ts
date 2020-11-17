import { Injectable } from '@nestjs/common';
import { MessengerContext } from 'bottender';
import { messenger, router } from 'bottender/router';
import { DEFAULT_MESSENGER_LOCALE } from 'common/config/constants';
import { getUserOptions } from 'common/utils';
import { GET_STARTED_PAYLOAD } from 'modules/bots/messenger-bot/messenger-bot.constants';
import { MessengerBotController } from 'modules/bots/messenger-bot/messenger-bot.controller';
import { BotUserService } from 'modules/bot-user/user.service';
import { ResponseService } from './response.service';

@Injectable()
export class MessengerBotService {
  constructor(
    private readonly controller: MessengerBotController,
    private readonly responseService: ResponseService,
    private readonly userService: BotUserService,
  ) {}

  private asyncWrap = (fn) => async (context: MessengerContext) => {
    const {
      event: { postback },
    } = context;
    const userOptions = getUserOptions(context);
    const user = await this.userService.validateUser(userOptions);

    if (!user && postback?.payload !== GET_STARTED_PAYLOAD) {
      const {
        locale = DEFAULT_MESSENGER_LOCALE,
      } = await context.getUserProfile({ fields: ['locale'] });

      const response = this.responseService.getRegisterUserFailureResponse(
        locale,
      );
      return this.controller.say(context, response);
    }

    await fn(context);
  };

  handleMessenger = () =>
    router([
      messenger.message(this.asyncWrap(this.controller.messageHandler)),
      messenger.postback(this.asyncWrap(this.controller.postbackHandler)),
    ]);
}
