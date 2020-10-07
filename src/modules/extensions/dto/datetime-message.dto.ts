import { IsNotEmpty } from 'class-validator';

export class DatetimeMessageDto {
  @IsNotEmpty()
  datetime: Date;

  @IsNotEmpty()
  user_id: number;
}
