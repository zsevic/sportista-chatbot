import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { authenticate } from 'passport';
import { jwtConfig, facebookConfig, googleConfig } from 'common/config/auth';
import { EventsModule } from 'common/events/events.module';
import { StrategyCallbackMiddleware } from './middlewares';
import { FacebookStrategy } from 'modules/auth/strategies/facebook';
import { GoogleStrategy } from 'modules/auth/strategies/google';
import { UserModule } from 'modules/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy, jwtFactory } from './strategies/jwt';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfig, facebookConfig, googleConfig],
    }),
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtFactory),
    EventsModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, FacebookStrategy, GoogleStrategy, AuthService],
  exports: [PassportModule.register({ defaultStrategy: 'jwt' })],
})
export class AuthModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  public configure(consumer: MiddlewareConsumer) {
    const LOGIN_FAILED_REDIRECTION_URL = this.configService.get(
      'LOGIN_FAILED_REDIRECTION_URL',
    );

    consumer
      .apply(
        authenticate('facebook', {
          session: false,
          scope: ['email', 'profile'],
          failureRedirect: LOGIN_FAILED_REDIRECTION_URL,
        }),
      )
      .forRoutes('/auth/facebook')
      .apply(StrategyCallbackMiddleware)
      .forRoutes('/auth/facebook/callback')
      .apply(
        authenticate('google', {
          session: false,
          scope: ['email', 'profile'],
          failureRedirect: LOGIN_FAILED_REDIRECTION_URL,
        }),
      )
      .forRoutes('/auth/google')
      .apply(StrategyCallbackMiddleware)
      .forRoutes('/auth/google/callback');
  }
}
