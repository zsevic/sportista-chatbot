import { Injectable, Inject } from '@nestjs/common';
import i18n from 'i18n';
import { I18N_OPTIONS } from './constants';
import { I18nOptions } from './interfaces';

interface II18nService {
  getInstance();
}

@Injectable()
export class I18nService implements II18nService {
  private _instance: any;
  constructor(@Inject(I18N_OPTIONS) private _I18nOptions: I18nOptions) {}
  getInstance() {
    if (!this._instance) {
      i18n.configure(this._I18nOptions);
      this._instance = i18n;
      return this._instance;
    }
    return this._instance;
  }
}
