import { Inject, Injectable } from '@nestjs/common';
import convertToLatin from 'cyrillic-to-latin';
import { ActivityRepository } from 'modules/activity/activity.repository';
import { BOOTBOT_OPTIONS_FACTORY } from 'modules/external/bootbot';
import { I18N_OPTIONS_FACTORY } from 'modules/external/i18n';
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
    const { organizer, type } = await this.activityRepository.findOne(
      activityId,
      {
        relations: ['organizer'],
      },
    );
    const name = convertToLatin(`${first_name} ${last_name}`);
    const textMessage = await this.i18nService.__mf(
      { phrase, locale: organizer.locale },
      {
        GENDER: gender,
        name,
        type,
      },
    );
    await this.bot.sendTextMessage(organizer.id, textMessage);
  };
}
