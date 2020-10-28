import 'newrelic';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import throng from 'throng';
import { setupApiDocs } from 'common/config/api-docs';
import { AllExceptionsFilter } from 'common/filters';
import { sslRedirect } from 'common/middlewares';
import { CustomValidationPipe } from 'common/pipes';
import { checkIsProdEnv } from 'common/utils';
import { AppModule } from 'modules/app/app.module';

const isProdEnv = checkIsProdEnv();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger(bootstrap.name);
  const configService = app.get('configService');

  app.enableShutdownHooks();
  app.get(AppModule).subscribeToShutdown(() => app.close());

  app.use(sslRedirect());
  app.use(compression());
  app.use(cookieParser());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrcElem: [
            "'self'",
            "'unsafe-inline'",
            'https://connect.facebook.com',
            'https://connect.facebook.net',
          ],
          styleSrcElem: ["'self'", 'https://stackpath.bootstrapcdn.com'],
        },
      },
    }),
  );
  app.use(morgan('combined'));
  app.setViewEngine('ejs');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new CustomValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );
  app.use('/webhook', bodyParser.raw({ type: 'application/json' }));
  setupApiDocs(app);

  if (isProdEnv) {
    Sentry.init({
      dsn: configService.get('SENTRY_DSN'),
    });
  }

  await app.listen(configService.get('PORT')).then(() => {
    logger.log(`Server is running on port ${configService.get('PORT')}`);
  });
}

throng({
  count: process.env.WEB_CONCURRENCY || 1,
  lifetime: Infinity,
  worker: bootstrap,
});

process.on('unhandledRejection', function handleUnhandledRejection(
  err: Error,
): void {
  const logger = new Logger(handleUnhandledRejection.name);
  logger.error(err.stack);
  if (isProdEnv) {
    Sentry.captureException(err);
  }
});
