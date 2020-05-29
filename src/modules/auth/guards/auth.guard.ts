import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { cookieExtractor } from 'modules/auth/extractors';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
} from 'modules/auth/auth.constants';
import { AuthService } from 'modules/auth/auth.service';
import { UserService } from 'modules/user/user.service';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
  private logger = new Logger(CustomAuthGuard.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const accessToken = ExtractJwt.fromExtractors([cookieExtractor])(request);

    const isValidAccessToken = this.authService.validateToken(accessToken);
    if (isValidAccessToken) return this.activate(context);

    try {
      const refreshToken = request.cookies[REFRESH_TOKEN_COOKIE_NAME];
      if (!refreshToken)
        throw new UnauthorizedException('Refresh token is not set');
      const isValidRefreshToken = this.authService.validateToken(refreshToken);
      if (!isValidRefreshToken)
        throw new UnauthorizedException('Refresh token is not valid');

      const user = await this.userService.getByRefreshToken(refreshToken);
      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      } = this.authService.createTokens(user.id);

      await this.userService.updateRefreshToken(user.id, newRefreshToken);

      request.cookies[ACCESS_TOKEN_COOKIE_NAME] = newAccessToken;
      request.cookies[REFRESH_TOKEN_COOKIE_NAME] = newRefreshToken;

      response.cookie(ACCESS_TOKEN_COOKIE_NAME, newAccessToken, COOKIE_OPTIONS);
      response.cookie(
        REFRESH_TOKEN_COOKIE_NAME,
        newRefreshToken,
        COOKIE_OPTIONS,
      );

      return this.activate(context);
    } catch (err) {
      this.logger.error(err.message);
      response.clearCookie(ACCESS_TOKEN_COOKIE_NAME, COOKIE_OPTIONS);
      response.clearCookie(REFRESH_TOKEN_COOKIE_NAME, COOKIE_OPTIONS);
      return false;
    }
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
