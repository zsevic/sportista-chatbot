import { Inject, Injectable } from '@nestjs/common';
import convertToLatin from 'cyrillic-to-latin';
import { DEFAULT_LOCALE, LOCALES } from 'common/config/constants';
import { formatDatetime } from 'common/utils';
import { ACTIVITY_TYPES } from 'modules/activity/activity.constants';
import { Activity } from 'modules/activity/activity.dto';
import { ActivityRepository } from 'modules/activity/activity.repository';
import {
  ACTIVITY_REMAINING_VACANCIES,
  APPLY_FOR_ACTIVITY,
  APPLY_FOR_ACTIVITY_TYPE,
  BOT_CANCEL_ACTIVITY_NOTIFICATION,
  LOCATION,
  ORGANIZER,
  ORGANIZER_TYPE,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { BOOTBOT_OPTIONS_FACTORY } from 'modules/external/bootbot';
import { I18N_OPTIONS_FACTORY } from 'modules/external/i18n';
import { Participation } from 'modules/participation/participation.dto';
import { User } from 'modules/user/user.dto';
import { UserService } from 'modules/user/user.service';
import { DatetimeOptions } from 'common/types';
import {
  getImageUrl,
  getLocationUrl,
} from 'modules/bots/messenger-bot/messenger-bot.utils';

@Injectable()
export class NotificationService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    @Inject(BOOTBOT_OPTIONS_FACTORY) private readonly bot,
    @Inject(I18N_OPTIONS_FACTORY) private readonly i18nService,
    private readonly userService: UserService,
  ) {}

  notifyOrganizerAboutParticipantUpdate = async (
    activityId: string,
    userId: number,
    notification: string,
  ) => {
    const { first_name, gender, last_name } = await this.userService.getUser(
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
      { phrase: notification, locale: organizer.locale },
      {
        GENDER: gender,
        name,
        type,
        datetime: formattedDatetime,
      },
    );
    await this.bot.sendTextMessage(organizer.id, textMessage);
  };

  notifyParticipantsAboutCanceledActivity = async (
    participationList: Participation[],
  ) => {
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

  notifySubscribedUsersAboutNewActivityNearby = async (activity: Activity) => {
    const users = await this.userService.getSubscribedUsersNearby(
      activity.location.latitude,
      activity.location.longitude,
    );
    const sendNewActivity = users.map((user: User) => {
      const response = this.getNewActivityNotification(activity, {
        locale: user.locale,
        timezone: user.timezone,
      });

      return this.bot.sendGenericTemplate(user.id, response);
    });

    return Promise.all(sendNewActivity);
  };

  private getNewActivityNotification = (
    activity: Activity,
    options: DatetimeOptions,
  ) => {
    const { locale } = options;
    const title = this.i18nService.__(
      { phrase: ACTIVITY_REMAINING_VACANCIES, locale },
      {
        remainingVacancies: activity.remaining_vacancies,
        type: activity.type,
      },
    );
    const { activity: activityI18n } = this.i18nService.getCatalog(locale);
    const buttonPayload = `type=${APPLY_FOR_ACTIVITY_TYPE}&activity_id=${activity.id}`;
    const url = getLocationUrl(
      activity.location.latitude,
      activity.location.longitude,
    );

    const buttons = [
      {
        type: 'postback',
        title: activityI18n[APPLY_FOR_ACTIVITY],
        payload: buttonPayload,
      },
      { type: 'web_url', title: activityI18n[LOCATION], url },
      {
        type: 'postback',
        title: activityI18n[ORGANIZER],
        payload: `type=${ORGANIZER_TYPE}&user_id=${activity.organizer_id}`,
      },
    ];
    const datetime = formatDatetime(activity.datetime, options);
    const price = new Intl.NumberFormat(
      LOCALES[options.locale] || LOCALES[DEFAULT_LOCALE],
      { style: 'currency', currency: activity.price.currency_code },
    ).format(activity.price.value);

    return [
      {
        title,
        subtitle: `${datetime}, ${activity.location.title}, ${price}`,
        ...(ACTIVITY_TYPES[activity.type] && {
          image_url: getImageUrl(ACTIVITY_TYPES[activity.type]),
        }),
        buttons,
      },
    ];
  };
}
