import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { handle } from 'main';

@Controller('webhooks')
export class WebhooksController {
  @Get('messenger')
  async validateWebhook(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    return handle(req, res);
  }

  @Post('messenger')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    return handle(req, res);
  }
}
