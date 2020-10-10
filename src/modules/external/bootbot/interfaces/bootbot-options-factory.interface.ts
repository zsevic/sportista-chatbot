import { BootbotOptions } from './bootbot-options.interface';

export interface BootbotOptionsFactory {
  createBootbotOptions(): Promise<BootbotOptions> | BootbotOptions;
}
