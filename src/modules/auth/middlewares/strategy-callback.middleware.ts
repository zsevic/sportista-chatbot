import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
} from 'modules/auth/auth.constants';
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

    const { accessToken, refreshToken } = this.authService.createTokens(
      user.id,
    );
    const LOGIN_SUCCESS_REDIRECTION_URL = this.configService.get(
      'LOGIN_SUCCESS_REDIRECTION_URL',
    );
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, COOKIE_OPTIONS);
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, COOKIE_OPTIONS);

    return res.redirect(LOGIN_SUCCESS_REDIRECTION_URL);
  }
}
