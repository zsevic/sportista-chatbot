import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from 'common/config';
import { MessengerBotModule } from 'modules/bots/messenger-bot/messenger-bot.module';
import { ExtensionsController } from './extensions.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  controllers: [ExtensionsController],
  providers: [MessengerBotModule],
})
export class ExtensionsModule {}
