import { Injectable, Logger } from '@nestjs/common';
import { MessengerContext } from 'bottender';
import { messenger, router } from 'bottender/router';
import { DEFAULT_MESSENGER_LOCALE } from 'common/config/constants';
import { GET_STARTED_PAYLOAD } from 'modules/bots/messenger-bot/messenger-bot.constants';
import { MessengerBotController } from 'modules/bots/messenger-bot/messenger-bot.controller';
import { Message } from 'modules/bots/messenger-bot/messenger-bot.types';
import {
  isButtonTemplate,
  isGenericTemplate,
  isQuickReplyTemplate,
} from 'modules/bots/messenger-bot/messenger-bot.type-guards';
import { getUserOptions } from 'modules/bots/messenger-bot/messenger-bot.utils';
import { BotUserService } from 'modules/bot-user/user.service';
import { ResponseService } from './response.service';

@Injectable()
export class MessengerBotService {
  private readonly logger = new Logger(MessengerBotService.name);

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
      return this.say(context, response);
    }

    const response = await fn(context);
    return this.say(context, response);
  };

  handleMessenger = () =>
    router([
      messenger.message(this.asyncWrap(this.controller.messageHandler)),
      messenger.postback(this.asyncWrap(this.controller.postbackHandler)),
    ]);

  private say = async (
    context: MessengerContext,
    message: Message | Message[],
  ) => {
    const {
      _session: {
        user: { id: recipientId },
      },
    } = context;
    if (typeof message === 'string') {
      return context.client.sendText(recipientId, message);
    } else if (isQuickReplyTemplate(message)) {
      return context.client.sendText(recipientId, message.text, {
        quickReplies: message.quickReplies,
      });
    } else if (isButtonTemplate(message)) {
      return context.client.sendTemplate(recipientId, {
        templateType: 'button',
        ...message,
      });
    } else if (isGenericTemplate(message)) {
      return context.client.sendGenericTemplate(recipientId, message.cards);
    } else if (Array.isArray(message)) {
      return message.reduce((promise, msg) => {
        return promise.then(() => this.say(context, msg));
      }, Promise.resolve(undefined));
    }
    this.logger.error('Invalid format for .say() message.');
  };
}
