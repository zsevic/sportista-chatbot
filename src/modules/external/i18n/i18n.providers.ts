import { I18N_OPTIONS, I18N_OPTIONS_FACTORY } from './constants';
import { I18nService } from './i18n.service';
import { I18nOptions } from './interfaces';

export function createI18nProviders(options: I18nOptions) {
  return [
    {
      provide: I18N_OPTIONS,
      useValue: options,
    },
  ];
}

export const i18nFactory = {
  provide: I18N_OPTIONS_FACTORY,
  inject: [I18nService],
  useFactory: async (i18nService: I18nService) => {
    return i18nService.getInstance();
  },
};
