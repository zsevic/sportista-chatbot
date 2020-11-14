import { Injectable } from '@nestjs/common';
import { platform, router } from 'bottender/router';
import { MessengerBotService } from 'modules/bots/messenger-bot/services';

@Injectable()
export class BotsService {
  constructor(private readonly messengerBotService: MessengerBotService) {}

  getRouter = () =>
    router([platform('messenger', this.messengerBotService.handleMessenger)]);
}
