import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { handle } from 'main';

@Controller('webhooks/messenger')
export class WebhooksController {
  @Get()
  async validateWebhook(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    return handle(req, res);
  }

  @Post()
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    return handle(req, res);
  }
}
