import {
  BadRequestException,
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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'common/guards/auth.guard';
import { BOOTBOT_OPTIONS_FACTORY } from 'modules/external/bootbot';

@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);
  constructor(@Inject(BOOTBOT_OPTIONS_FACTORY) private readonly bot) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  validateWebhook(@Query() query) {
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

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.OK)
  handleWebhook(@Body() rawBody) {
    const data = JSON.parse(rawBody.toString());
    if (data.object !== 'page') {
      throw new BadRequestException();
    }

    this.bot.handleFacebookData(data);
  }
}
