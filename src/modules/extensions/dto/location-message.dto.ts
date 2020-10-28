import { IsNotEmpty } from 'class-validator';

export class LocationMessageDto {
  @IsNotEmpty()
  latitude: number;

  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  _csrf: string;
}
