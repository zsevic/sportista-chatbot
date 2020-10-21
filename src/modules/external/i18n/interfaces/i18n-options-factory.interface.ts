import { I18nOptions } from './i18n-options.interface';

export interface I18nOptionsFactory {
  createI18nOptions(): Promise<I18nOptions> | I18nOptions;
}
