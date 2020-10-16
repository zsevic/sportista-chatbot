import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { USER_LOCATION_TYPE } from 'modules/bots/messenger-bot/messenger-bot.constants';
import { BOOTBOT_OPTIONS_FACTORY } from 'modules/external/bootbot';
import { DatetimeMessageDto, LocationMessageDto } from './dto';

@Controller('extensions')
export class ExtensionsController {
  constructor(@Inject(BOOTBOT_OPTIONS_FACTORY) private readonly bot) {}

  @Get('datetime')
  getDatetimePage(@Res() res: Response) {
    return res.render('pages/datetime-picker.ejs');
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
  getLocationPage(@Res() res: Response) {
    return res.render('pages/location.ejs');
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
