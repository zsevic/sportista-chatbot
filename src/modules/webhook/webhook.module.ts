import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from 'common/config';
import { MessengerBotModule } from 'modules/bots/messenger-bot/messenger-bot.module';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    MessengerBotModule,
  ],
  controllers: [WebhookController],
  providers: [MessengerBotModule],
})
export class WebhookModule {}
