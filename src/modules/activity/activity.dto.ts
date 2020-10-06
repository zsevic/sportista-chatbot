import { Type } from 'class-transformer';
import { Location } from './location/location.dto';

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

  price: number;

  remaining_vacancies: number;

  type: string;
}
