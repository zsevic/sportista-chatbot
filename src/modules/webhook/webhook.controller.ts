import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { BOOTBOT_OPTIONS_FACTORY } from 'modules/external/bootbot';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  constructor(@Inject(BOOTBOT_OPTIONS_FACTORY) private readonly bot) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async validateWebhook(@Query() query) {
    if (
      query['hub.mode'] === 'subscribe' &&
      query['hub.verify_token'] === this.bot.verifyToken
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

    this.bot.handleFacebookData(data);
  }
}
