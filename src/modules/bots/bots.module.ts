import { Module } from '@nestjs/common';
import { MessengerBotModule } from './messenger-bot/messenger-bot.module';
import { BotsService } from './bots.service';

@Module({
  imports: [MessengerBotModule],
  providers: [BotsService],
})
export class BotsModule {}
