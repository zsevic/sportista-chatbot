import { Module } from '@nestjs/common';
import { MessengerBotModule } from './messenger-bot/messenger-bot.module';

@Module({
  imports: [MessengerBotModule],
})
export class BotsModule {}
