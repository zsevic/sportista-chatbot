import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from 'modules/app/app.module';
import { setupSwagger } from 'common/config/swagger';

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);
  app.useGlobalPipes(new ValidationPipe());
  setupSwagger(app);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
