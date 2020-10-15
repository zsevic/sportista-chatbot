import { Injectable } from '@nestjs/common';
import { ActivityService } from 'modules/activity/activity.service';
import { ResponseService } from 'modules/bots/messenger-bot/services/response.service';
import { StateService } from 'modules/state/state.service';
import { UserService } from 'modules/user/user.service';
import { ResolverService } from './resolver.service';

@Injectable()
export class AttachmentService {
  constructor(
    private readonly activityService: ActivityService,
    private readonly resolverService: ResolverService,
    private readonly responseService: ResponseService,
    private readonly stateService: StateService,
    private readonly userService: UserService,
  ) {}

  handleAttachment = async (message: any, userId: number) => {
    const { type, title } = message.attachments[0];
    const locale = await this.userService.getLocale(userId);

    const state = await this.resolverService.getCurrentState(userId);
    if (!state || !state.current_state || type !== 'location') {
      return this.resolverService.getDefaultResponse(locale);
    }

    if (state.current_state === this.stateService.states.location) {
      const {
        coordinates: { lat, long },
      } = message.attachments[0].payload;

      const isValidLocation = await this.activityService.validateLocation(
        userId,
        lat,
        long,
      );
      if (!isValidLocation)
        return this.responseService.getInvalidLocationResponse(locale);

      const updatedState = {
        location_title: title,
        location_latitude: lat,
        location_longitude: long,
        current_state:
          this.stateService.nextStates[state.current_state] || null,
      };

      return this.resolverService.updateState(userId, updatedState, locale);
    }

    await this.stateService.resetState(userId);
    return this.resolverService.getDefaultResponse(locale);
  };
}
