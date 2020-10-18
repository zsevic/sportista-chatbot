import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';
import { I18N_FALLBACK_LANGUAGE } from 'common/config/constants';
import {
  STATE_DATETIME_BUTTON,
  USER_LOCATION_FAILURE,
  USER_LOCATION_PAGE_TEXT,
  USER_LOCATION_TYPE,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { BOOTBOT_OPTIONS_FACTORY } from 'modules/external/bootbot';
import { DatetimeMessageDto, LocationMessageDto } from './dto';

@Controller('extensions')
export class ExtensionsController {
  constructor(
    @Inject(BOOTBOT_OPTIONS_FACTORY) private readonly bot,
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService,
  ) {}

  @Get('datetime')
  async getDatetimePage(@Res() res: Response, @Query() query) {
    const { lang = I18N_FALLBACK_LANGUAGE } = query;
    const datetimeButton = await this.i18nService.translate(
      STATE_DATETIME_BUTTON,
      { lang },
    );

    return res.render('pages/datetime-picker.ejs', {
      APP_ID: this.configService.get('FB_APP_ID'),
      DATETIME_BUTTON: datetimeButton,
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
                text: datetime,
              },
            },
          ],
        },
      ],
    };
    this.bot.handleFacebookData(messageData);
  }

  @Get('location')
  async getLocationPage(@Res() res: Response, @Query() query) {
    const { lang = I18N_FALLBACK_LANGUAGE } = query;
    const userI18n = await this.i18nService.translate('user', { lang });
    return res.render('pages/location.ejs', {
      APP_ID: this.configService.get('FB_APP_ID'),
      USER_LOCATION_FAILURE: userI18n[USER_LOCATION_FAILURE],
      USER_LOCATION_PAGE_TEXT: userI18n[USER_LOCATION_PAGE_TEXT],
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
