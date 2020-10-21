/* Dependencies */
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';

/* Interfaces */
import { I18nOptions } from './i18n-options.interface';
import { I18nOptionsFactory } from './i18n-options-factory.interface';

export interface I18nAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<I18nOptionsFactory>;
  useClass?: Type<I18nOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<I18nOptions> | I18nOptions;
}
