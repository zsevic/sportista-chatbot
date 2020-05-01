import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { COOKIE_OPTIONS, JWT_COOKIE_NAME } from 'modules/auth/auth.constants';
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
    if (!user.id) {
      const LOGIN_FAILED_REDIRECTION_URL = this.configService.get(
        'LOGIN_FAILED_REDIRECTION_URL',
      );
      return res.redirect(LOGIN_FAILED_REDIRECTION_URL);
    }

    const accessToken = this.authService.createToken(user);
    const LOGIN_SUCCESS_REDIRECTION_URL = this.configService.get(
      'LOGIN_SUCCESS_REDIRECTION_URL',
    );
    return res
      .cookie(JWT_COOKIE_NAME, accessToken, COOKIE_OPTIONS)
      .redirect(LOGIN_SUCCESS_REDIRECTION_URL);
  }
}
