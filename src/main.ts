import 'newrelic';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as Sentry from '@sentry/node';
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { WinstonModule } from 'nest-winston';
import throng from 'throng';
import { format, transports } from 'winston';
import { setupApiDocs } from 'common/config/api-docs';
import { AllExceptionsFilter } from 'common/filters';
import { loggerMiddleware, sslRedirect } from 'common/middlewares';
import { CustomValidationPipe } from 'common/pipes';
import { isEnv } from 'common/utils';
import { AppModule } from 'modules/app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      format: format.combine(
        format.timestamp(),
        format.json(),
      ),
      transports: [
        new (transports.Console)({
          level: process.env.LOG_LEVEL || 'info',
        }),
      ],
    })
  });
  const logger = new Logger(bootstrap.name);
  const configService = app.get('configService');

  app.enable('trust proxy'); // used for rate limiter
  app.enableShutdownHooks();
  app.get(AppModule).subscribeToShutdown(() => app.close());

  app.use(compression());
  app.use(cookieParser(configService.get('COOKIE_SECRET')));
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
  app.use(loggerMiddleware);
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

  if (isEnv('production')) {
    app.use(sslRedirect());
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
});
