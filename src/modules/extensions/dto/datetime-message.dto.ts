import { IsISO8601, IsNotEmpty } from 'class-validator';

export class DatetimeMessageDto {
  @IsNotEmpty()
  @IsISO8601()
  datetime: string;

  @IsNotEmpty()
  user_id: number;
}
