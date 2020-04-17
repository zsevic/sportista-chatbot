import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthService } from 'modules/auth/auth.service';
import { User } from 'modules/user/user.payload';

@Injectable()
export class StrategyCallbackMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response): Promise<void> {
    const user = req.user as User;
    if (!user?.id) {
      const LOGIN_FAILED_REDIRECTION_URL = this.configService.get(
        'LOGIN_FAILED_REDIRECTION_URL',
      );
      return res.redirect(LOGIN_FAILED_REDIRECTION_URL);
    }

    const accessToken = this.authService.createToken(user);
    const CLIENT_URL = this.configService.get('CLIENT_URL');
    return res.redirect(`${CLIENT_URL}/#/login/${accessToken}`);
  }
}
