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

  handleRequest(_, user, info: Error, context: ExecutionContext) {
    if (info?.name === 'TokenExpiredError') {
      const { cookies } = context.switchToHttp().getRequest();
      const refreshToken = cookies[REFRESH_TOKEN_COOKIE_NAME];
      if (!refreshToken) throw new UnauthorizedException(info.message);
      this.authService.verifyToken(refreshToken);

      return this.userService
        .getByRefreshToken(refreshToken)
        .then(user => {
          const { accessToken, refreshToken } = this.authService.createTokens(
            user.id,
          );
          return this.userService
            .updateRefreshToken(user.id, refreshToken)
            .then(() => ({ accessToken, refreshToken, user }));
        })
        .then(({ accessToken, refreshToken, user }) => {
          const response = context.switchToHttp().getResponse();
          response.cookie(
            ACCESS_TOKEN_COOKIE_NAME,
            accessToken,
            COOKIE_OPTIONS,
          );
          response.cookie(
            REFRESH_TOKEN_COOKIE_NAME,
            refreshToken,
            COOKIE_OPTIONS,
          );

          return user;
        })
        .catch((err: Error) => {
          throw new UnauthorizedException(err.message);
        });
    }
    return user;
  }
}
