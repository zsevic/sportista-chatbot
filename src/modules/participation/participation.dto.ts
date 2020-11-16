import { Type } from 'class-transformer';
import { Activity } from 'modules/activity/activity.dto';
import { BotUser } from 'modules/bot-user/user.dto';
import { PARTICIPATION_STATUS } from './participation.enums';

export class Participation {
  id: string;

  activity_id: string;

  participant_id: number;

  status: PARTICIPATION_STATUS;

  @Type(() => Activity)
  activity?: Activity;

  @Type(() => BotUser)
  participant?: BotUser;
}
