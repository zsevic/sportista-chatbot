import { Injectable } from '@nestjs/common';
import { MessengerContext } from 'bottender';
import { messenger, router } from 'bottender/router';
import { DEFAULT_MESSENGER_LOCALE } from 'common/config/constants';
import { GET_STARTED_PAYLOAD } from 'modules/bots/messenger-bot/messenger-bot.constants';
import { MessengerBotController } from 'modules/bots/messenger-bot/messenger-bot.controller';
import { UserService } from 'modules/user/user.service';
import { ResponseService } from './response.service';

@Injectable()
export class MessengerBotService {
  constructor(
    private readonly controller: MessengerBotController,
    private readonly responseService: ResponseService,
    private readonly userService: UserService,
  ) {}

  private asyncWrap = (fn) => async (context: MessengerContext) => {
    const user = await this.userService.validateUser(context._session.user.id);

    if (!user && context.event.postback?.payload !== GET_STARTED_PAYLOAD) {
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
