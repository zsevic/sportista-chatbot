import { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'modules/app/app.module';
import { BotsModule } from 'modules/bots/bots.module';
import { BotsService } from 'modules/bots/bots.service';

const appContext = (function () {
  let _instance;
  return {
    get: async (): Promise<INestApplicationContext> => {
      if (!_instance) {
        _instance = await NestFactory.createApplicationContext(AppModule);
      }
      return _instance;
    },
  };
})();

export default async function App() {
  const app = await appContext.get();
  const chatbotService = app
    .select(BotsModule)
    .get(BotsService, { strict: true });

  return chatbotService.getRouter();
}
