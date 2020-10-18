import { IsIn } from 'class-validator';
import { I18N_FALLBACKS } from 'common/config/constants';

export class LocationQueryDto {
  @IsIn([Object.keys(I18N_FALLBACKS)])
  lang: string;
}
