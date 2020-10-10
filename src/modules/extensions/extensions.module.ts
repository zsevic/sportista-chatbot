import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from 'common/config';
import { ExtensionsController } from './extensions.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  controllers: [ExtensionsController],
})
export class ExtensionsModule {}
