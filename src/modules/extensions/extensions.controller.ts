import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { I18N_FALLBACK_LANGUAGE } from 'common/config/constants';
import {
  STATE_DATETIME_BUTTON,
  USER_LOCATION_FAILURE,
  USER_LOCATION_PAGE_TEXT,
  USER_LOCATION_SETTINGS_FAILURE,
  USER_LOCATION_TYPE,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { BOOTBOT_OPTIONS_FACTORY } from 'modules/external/bootbot';
import { I18N_OPTIONS_FACTORY } from 'modules/external/i18n';
import { DatetimeMessageDto, LocationMessageDto } from './dto';

@Controller('extensions')
export class ExtensionsController {
  constructor(
    @Inject(BOOTBOT_OPTIONS_FACTORY) private readonly bot,
    private readonly configService: ConfigService,
    @Inject(I18N_OPTIONS_FACTORY) private readonly i18nService,
  ) {}

  @Get('datetime')
  async getDatetimePage(@Res() res: Response, @Req() req, @Query() query) {
    const { lang: locale = I18N_FALLBACK_LANGUAGE } = query;
    const datetimeButton = this.i18nService.__({
      phrase: STATE_DATETIME_BUTTON,
      locale,
    });

    return res.render('pages/datetime-picker.ejs', {
      APP_ID: this.configService.get('FB_APP_ID'),
      DATETIME_BUTTON: datetimeButton,
      csrfToken: req.csrfToken(),
    });
  }

  @Post('datetime')
  @HttpCode(HttpStatus.OK)
  getDatetime(@Body() data: DatetimeMessageDto) {
    const { datetime, user_id } = data;
    const messageData = {
      object: 'page',
      entry: [
        {
          messaging: [
            {
              sender: { id: user_id },
              message: {
                text: new Date(datetime).toISOString(),
              },
            },
          ],
        },
      ],
    };
    this.bot.handleFacebookData(messageData);
  }

  @Get('location')
  async getLocationPage(@Res() res: Response, @Req() req, @Query() query) {
    const { lang: locale = I18N_FALLBACK_LANGUAGE } = query;
    const { user: userI18n } = this.i18nService.getCatalog(locale);

    return res.render('pages/location.ejs', {
      APP_ID: this.configService.get('FB_APP_ID'),
      USER_LOCATION_FAILURE: userI18n[USER_LOCATION_FAILURE],
      USER_LOCATION_PAGE_TEXT: userI18n[USER_LOCATION_PAGE_TEXT],
      USER_LOCATION_SETTINGS_FAILURE: userI18n[USER_LOCATION_SETTINGS_FAILURE],
      csrfToken: req.csrfToken(),
    });
  }

  @Post('location')
  @HttpCode(HttpStatus.OK)
  getLocation(@Body() data: LocationMessageDto) {
    const { latitude, longitude, user_id } = data;
    const messageData = {
      object: 'page',
      entry: [
        {
          messaging: [
            {
              sender: { id: user_id },
              postback: {
                payload: `type=${USER_LOCATION_TYPE}&latitude=${latitude}&longitude=${longitude}`,
              },
            },
          ],
        },
      ],
    };
    this.bot.handleFacebookData(messageData);
  }
}
