import { BootbotService } from './bootbot.service';
import { BOOTBOT_OPTIONS, BOOTBOT_OPTIONS_FACTORY } from './constants';
import { BootbotOptions } from './interfaces';

export function createBootbotProviders(options: BootbotOptions) {
  return [
    {
      provide: BOOTBOT_OPTIONS,
      useValue: options,
    },
  ];
}

export const bootbotFactory = {
  provide: BOOTBOT_OPTIONS_FACTORY,
  inject: [BootbotService],
  useFactory: async (bootbotService: BootbotService) => {
    return bootbotService.getInstance();
  },
};
