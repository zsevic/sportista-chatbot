import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
} from 'modules/auth/auth.constants';
import { AuthService } from 'modules/auth/auth.service';
import { UserService } from 'modules/user/user.service';

@Injectable()
export class CustomAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super();
  }

  handleRequest(_, loggedInUser, info: Error, context: ExecutionContext) {
    const response = context.switchToHttp().getResponse();
    try {
      if (info?.name === 'TokenExpiredError') {
        const { cookies } = context.switchToHttp().getRequest();
        const refreshToken = cookies[REFRESH_TOKEN_COOKIE_NAME];
        if (!refreshToken) throw new UnauthorizedException(info.message);
        this.authService.verifyToken(refreshToken);

        return this.userService
          .getByRefreshToken(refreshToken)
          .then(user => {
            const {
              accessToken,
              refreshToken: newRefreshToken,
            } = this.authService.createTokens(user.id);
            return this.userService
              .updateRefreshToken(user.id, newRefreshToken)
              .then(() => ({ accessToken, newRefreshToken, user }));
          })
          .then(({ accessToken, newRefreshToken, user }) => {
            response.cookie(
              ACCESS_TOKEN_COOKIE_NAME,
              accessToken,
              COOKIE_OPTIONS,
            );
            response.cookie(
              REFRESH_TOKEN_COOKIE_NAME,
              newRefreshToken,
              COOKIE_OPTIONS,
            );

            return user;
          });
      }
      return loggedInUser;
    } catch (err) {
      response.clearCookie(ACCESS_TOKEN_COOKIE_NAME, COOKIE_OPTIONS);
      response.clearCookie(REFRESH_TOKEN_COOKIE_NAME, COOKIE_OPTIONS);
      throw new UnauthorizedException(err.message);
    }
  }
}
