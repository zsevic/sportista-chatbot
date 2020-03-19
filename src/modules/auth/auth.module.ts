import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { authenticate } from 'passport';
import { jwtConfig, facebookConfig, googleConfig } from 'common/config/auth';
import { EventsModule } from 'common/events/events.module';
import { SessionAuthMiddleware, StrategyCallbackMiddleware } from 'common/middlewares';
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
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SessionAuthMiddleware).forRoutes('/auth/facebook')
      .apply(authenticate('facebook', { session: false, scope: ['email', 'profile'] })).forRoutes('/auth/facebook')
      .apply(StrategyCallbackMiddleware).forRoutes('/auth/facebook/callback')
      .apply(SessionAuthMiddleware).forRoutes('/auth/google')
      .apply(authenticate('google', { session: false, scope: ['email', 'profile'] })).forRoutes('/auth/google')
      .apply(StrategyCallbackMiddleware).forRoutes('/auth/google/callback');
  }
}
