import { Type } from 'class-transformer';
import { Location } from 'modules/location/location.dto';
import { BotUser } from 'modules/bot-user/user.dto';
import { Price } from './price/price.dto';

export class Activity {
  id?: string;

  organizer_id: number;

  datetime: string;

  location_id?: string;

  location_title?: string;

  location_latitude?: number;

  location_longitude?: number;

  @Type(() => Location)
  location?: Location;

  @Type(() => BotUser)
  organizer?: BotUser;

  price_id?: string;

  @Type(() => Price)
  price?: Price;

  remaining_vacancies: number;

  type: string;
}
