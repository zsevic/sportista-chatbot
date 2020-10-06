import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { MessengerBotModule } from 'modules/bots/messenger-bot/messenger-bot.module';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  constructor(private readonly messengerBot: MessengerBotModule) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async validateWebhook(@Query() query) {
    if (
      query['hub.mode'] === 'subscribe' &&
      query['hub.verify_token'] === this.messengerBot.instance.verifyToken
    ) {
      this.logger.log('Validation Succeded.');
      return query['hub.challenge'];
    } else {
      this.logger.error(
        'Failed validation. Make sure the validation tokens match.',
      );
      throw new ForbiddenException();
    }
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() data) {
    if (data.object !== 'page') {
      return;
    }

    this.messengerBot.instance.handleFacebookData(data);
  }
}
