import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { MessengerBotModule } from 'modules/bots/messenger-bot/messenger-bot.module';
import { DatetimeMessageDto } from './dto';

@Controller('extensions')
export class ExtensionsController {
  constructor(private readonly messengerBot: MessengerBotModule) {}

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
    this.messengerBot.instance.handleFacebookData(messageData);
  }
}
