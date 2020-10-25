import { Inject, Injectable } from '@nestjs/common';
import convertToLatin from 'cyrillic-to-latin';
import { formatDatetime } from 'common/utils';
import { ActivityRepository } from 'modules/activity/activity.repository';
import { BOT_CANCEL_ACTIVITY_NOTIFICATION } from 'modules/bots/messenger-bot/messenger-bot.constants';
import { BOOTBOT_OPTIONS_FACTORY } from 'modules/external/bootbot';
import { I18N_OPTIONS_FACTORY } from 'modules/external/i18n';
import { Participation } from 'modules/participation/participation.dto';
import { UserRepository } from 'modules/user/user.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    @Inject(BOOTBOT_OPTIONS_FACTORY) private readonly bot,
    @Inject(I18N_OPTIONS_FACTORY) private readonly i18nService,
    private readonly userRepository: UserRepository,
  ) {}

  notifyOrganizer = async (
    activityId: string,
    userId: number,
    phrase: string,
  ) => {
    const { first_name, gender, last_name } = await this.userRepository.findOne(
      userId,
    );
    const { organizer, datetime, type } = await this.activityRepository.findOne(
      activityId,
      {
        relations: ['organizer'],
      },
    );
    const name = convertToLatin(`${first_name} ${last_name}`);
    const formattedDatetime = formatDatetime(datetime, {
      locale: organizer.locale,
      timezone: organizer.timezone,
    });
    const textMessage = this.i18nService.__mf(
      { phrase, locale: organizer.locale },
      {
        GENDER: gender,
        name,
        type,
        datetime: formattedDatetime,
      },
    );
    await this.bot.sendTextMessage(organizer.id, textMessage);
  };

  notifyParticipants = async (participationList: Participation[]) => {
    const sendTextMessages = participationList.map(
      (participation: Participation) => {
        const {
          activity: { datetime, type },
          participant: { locale, timezone },
        } = participation;
        const formattedDatetime = formatDatetime(datetime, {
          locale,
          timezone,
        });
        const textMessage = this.i18nService.__(
          { phrase: BOT_CANCEL_ACTIVITY_NOTIFICATION, locale },
          { type, datetime: formattedDatetime },
        );
        return this.bot.sendTextMessage(
          participation.participant_id,
          textMessage,
        );
      },
    );

    return Promise.all(sendTextMessages);
  };
}
