import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

import { BootbotOptions } from './bootbot-options.interface';
import { BootbotOptionsFactory } from './bootbot-options-factory.interface';

export interface BootbotAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<BootbotOptionsFactory>;
  useClass?: Type<BootbotOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<BootbotOptions> | BootbotOptions;
}
