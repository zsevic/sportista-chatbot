import { NestFactory } from '@nestjs/core';
import { AppModule } from 'modules/app/app.module';
import { setupSwagger } from 'common/config/swagger';
import { loggerMiddleware } from 'common/middlewares';
import { CustomValidationPipe } from 'common/pipes';

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);
  const logger = app.get('logger');

  app.use(loggerMiddleware(logger));
  app.useGlobalPipes(new CustomValidationPipe(logger));
  setupSwagger(app);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
