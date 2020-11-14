import { createHmac } from 'crypto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { I18N_FALLBACK_LANGUAGE } from 'common/config/constants';
import { handle } from 'main';
import {
  STATE_DATETIME_BUTTON,
  USER_LOCATION_FAILURE,
  USER_LOCATION_PAGE_TEXT,
  USER_LOCATION_SETTINGS_FAILURE,
  USER_LOCATION_TYPE,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { I18N_OPTIONS_FACTORY } from 'modules/external/i18n';
import { DatetimeMessageDto, LocationMessageDto } from './dto';

@Controller('extensions')
export class ExtensionsController {
  constructor(
    private readonly configService: ConfigService,
    @Inject(I18N_OPTIONS_FACTORY) private readonly i18nService,
  ) {}

  @Get('datetime')
  @Render('pages/datetime-picker')
  async getDatetimePage(@Req() req, @Query() query) {
    const { lang: locale = I18N_FALLBACK_LANGUAGE } = query;
    const datetimeButton = this.i18nService.__({
      phrase: STATE_DATETIME_BUTTON,
      locale,
    });

    return {
      APP_ID: this.configService.get('MESSENGER_APP_ID'),
      DATETIME_BUTTON: datetimeButton,
      csrfToken: req.csrfToken(),
    };
  }

  @Post('datetime')
  @HttpCode(HttpStatus.OK)
  getDatetime(
    @Body() data: DatetimeMessageDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { datetime, user_id: userId } = data;
    const messageBody = {
      text: new Date(datetime).toISOString(),
    };
    const requestBody = this.getRequestBody(userId, messageBody);

    this.transformRequest(req, requestBody);
    return handle(req, res);
  }

  @Get('location')
  @Render('pages/location')
  async getLocationPage(@Req() req, @Query() query) {
    const { lang: locale = I18N_FALLBACK_LANGUAGE } = query;
    const { user: userI18n } = this.i18nService.getCatalog(locale);

    return {
      APP_ID: this.configService.get('MESSENGER_APP_ID'),
      USER_LOCATION_FAILURE: userI18n[USER_LOCATION_FAILURE],
      USER_LOCATION_PAGE_TEXT: userI18n[USER_LOCATION_PAGE_TEXT],
      USER_LOCATION_SETTINGS_FAILURE: userI18n[USER_LOCATION_SETTINGS_FAILURE],
      csrfToken: req.csrfToken(),
    };
  }

  @Post('location')
  @HttpCode(HttpStatus.OK)
  getLocation(
    @Body() data: LocationMessageDto,
    @Req() req,
    @Res() res: Response,
  ) {
    const { latitude, longitude, user_id: userId } = data;

    const messageBody = {
      postback: {
        payload: `type=${USER_LOCATION_TYPE}&latitude=${latitude}&longitude=${longitude}`,
      },
    };

    const requestBody = this.getRequestBody(userId, messageBody);
    this.transformRequest(req, requestBody);
    return handle(req, res);
  }

  private getRequestBody = (userId: number, messageBody) => ({
    object: 'page',
    entry: [
      {
        id: this.configService.get('MESSENGER_PAGE_ID'),
        messaging: [
          {
            sender: { id: userId },
            recipient: { id: this.configService.get('MESSENGER_PAGE_ID') },
            ...messageBody,
          },
        ],
      },
    ],
  });

  private transformRequest = (req, requestBody) => {
    const appSecret = this.configService.get('MESSENGER_APP_SECRET');
    const hmac = createHmac('sha1', appSecret);
    const signature = `sha1=${hmac
      .update(Buffer.from(JSON.stringify(requestBody)))
      .digest('hex')}`;

    req.headers = {
      ...req.headers,
      'x-hub-signature': signature,
    };
    req.url = '/webhooks/messenger';
    req.body = requestBody;
    req.rawBody = Buffer.from(JSON.stringify(requestBody));
  };
}
