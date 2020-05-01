import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from 'modules/app/app.module';
import { setupSwagger } from 'common/config/api-docs';
import { loggerMiddleware } from 'common/middlewares';
import { CustomValidationPipe } from 'common/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get('logger');
  const configService = app.get('configService');

  app.enableCors({
    credentials: true,
    origin: configService.get('CLIENT_URL'),
  });
  app.use(cookieParser());
  app.use(loggerMiddleware(logger));
  app.useGlobalPipes(
    new CustomValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );
  setupSwagger(app);

  await app.listen(configService.get('PORT'));
}

bootstrap();
