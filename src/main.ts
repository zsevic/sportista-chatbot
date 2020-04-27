import { NestFactory } from '@nestjs/core';
import * as expressSession from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import { AppModule } from 'modules/app/app.module';
import { setupSwagger } from 'common/config/api-docs';
import { loggerMiddleware } from 'common/middlewares';
import { CustomValidationPipe } from 'common/pipes';

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);
  const logger = app.get('logger');
  const configService = app.get('configService');

  app.use(cookieParser());
  app.use(loggerMiddleware(logger));
  app.useGlobalPipes(new CustomValidationPipe(logger));
  setupSwagger(app);

  app.use(passport.initialize());
  app.use(
    expressSession({
      secret: configService.get('EXPRESS_SESSION_SECRET'),
      resave: true,
      saveUninitialized: true,
    }),
  );

  await app.listen(configService.get('PORT'));
}

bootstrap();
