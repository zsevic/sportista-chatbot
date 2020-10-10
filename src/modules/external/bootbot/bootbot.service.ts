import { Injectable, Inject } from '@nestjs/common';
import BootBot from 'bootbot';
import { BOOTBOT_OPTIONS } from './constants';
import { BootbotOptions } from './interfaces';

interface IBootbotService {
  getInstance();
}

@Injectable()
export class BootbotService implements IBootbotService {
  private _instance: any;
  constructor(
    @Inject(BOOTBOT_OPTIONS) private _BootbotOptions: BootbotOptions,
  ) {}

  getInstance() {
    if (!this._instance) {
      this._instance = new BootBot(this._BootbotOptions);
    }
    return this._instance;
  }
}
