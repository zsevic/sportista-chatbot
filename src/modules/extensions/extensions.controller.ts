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
import { BOOTBOT_OPTIONS_FACTORY } from 'modules/external/bootbot';
import { DatetimeMessageDto } from './dto';

@Controller('extensions')
export class ExtensionsController {
  constructor(@Inject(BOOTBOT_OPTIONS_FACTORY) private readonly bot) {}

  @Get('datetime')
  getDatetime(@Res() res: Response) {
    return res.render('pages/datetime-picker.ejs');
  }

  @Post('datetime')
  @HttpCode(HttpStatus.OK)
  createDatetime(@Body() data: DatetimeMessageDto) {
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
}
