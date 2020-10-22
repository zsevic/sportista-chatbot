import { Inject, Injectable } from '@nestjs/common';
import { ActivityRepository } from 'modules/activity/activity.repository';
import { BOOTBOT_OPTIONS_FACTORY } from 'modules/external/bootbot';
import { I18N_OPTIONS_FACTORY } from 'modules/external/i18n';

@Injectable()
export class NotificationService {
  constructor(
    private readonly activityRepository: ActivityRepository,
    @Inject(BOOTBOT_OPTIONS_FACTORY) private readonly bot,
    @Inject(I18N_OPTIONS_FACTORY) private readonly i18nService,
  ) {}

  notifyOrganizer = async (
    activityId: string,
    phrase: string,
    locale: string,
  ) => {
    const { organizer_id } = await this.activityRepository.findOne(activityId);
    const textMessage = this.i18nService.__({
      phrase,
      locale,
    });
    await this.bot.sendTextMessage(organizer_id, textMessage);
  };
}
