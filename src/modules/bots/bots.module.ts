import { Module, OnModuleInit } from '@nestjs/common';
import { MessengerBotModule } from './messenger-bot/messenger-bot.module';
import { MessengerBotService } from './messenger-bot/services';

@Module({
  imports: [MessengerBotModule],
})
export class BotsModule implements OnModuleInit {
  constructor(private readonly messengerBotService: MessengerBotService) {}

  onModuleInit = () => {
    this.messengerBotService.init();
  };
}
