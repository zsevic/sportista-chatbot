import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from 'modules/app/app.module';
import { setupSwagger } from 'common/config/api-docs';
import { AllExceptionsFilter } from 'common/filters';
import { loggerMiddleware } from 'common/middlewares';
import { CustomValidationPipe } from 'common/pipes';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger(bootstrap.name);
  const configService = app.get('configService');

  app.enableCors({
    credentials: true,
    origin: configService.get('CLIENT_URL'),
  });
  app.use(cookieParser());
  app.use(loggerMiddleware);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new CustomValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );
  setupSwagger(app);

  await app.listen(configService.get('PORT')).then(() => {
    logger.log(`Server is running on port ${configService.get('PORT')}`);
  });
}

bootstrap();

process.on('unhandledRejection', function handleUnhandledRejection(
  err: Error,
): void {
  const logger = new Logger(handleUnhandledRejection.name);
  logger.error(err.stack);
});
