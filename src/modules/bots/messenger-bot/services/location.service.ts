import { Injectable } from '@nestjs/common';
import { MessengerContext } from 'bottender';
import { getUserOptions } from 'common/utils';
import { ActivityService } from 'modules/activity/activity.service';
import {
  nextStates,
  states,
} from 'modules/bots/messenger-bot/messenger-bot.states';
import { ResponseService } from 'modules/bots/messenger-bot/services/response.service';
import { PINNED_LOCATION } from 'modules/location/location.constants';
import { BotUserService } from 'modules/bot-user/user.service';

@Injectable()
export class LocationService {
  constructor(
    private readonly activityService: ActivityService,
    private readonly responseService: ResponseService,
    private readonly userService: BotUserService,
  ) {}

  handleLocation = async (context: MessengerContext): Promise<any> => {
    const {
      state: { current_state: currentState },
    } = context;
    const userOptions = getUserOptions(context);
    const locale = await this.userService.getLocale(userOptions);

    if (!currentState) {
      return this.responseService.getDefaultResponse(locale);
    }

    if (currentState === states.activity_location) {
      const {
        event: {
          location: {
            coordinates: { lat, long },
            title: title = PINNED_LOCATION,
          },
        },
      } = context;

      const isValidLocation = await this.activityService.validateLocation(
        userOptions,
        lat,
        long,
      );
      if (!isValidLocation)
        return this.responseService.getInvalidLocationResponse(locale);

      const nextState = nextStates[currentState] || null;
      context.setState({
        current_state: nextState,
        activity: {
          ...context.state.activity,
          location_title: title,
          location_latitude: lat,
          location_longitude: long,
        },
      });
      return this.responseService.getUpdateStateResponse(nextState, locale);
    }

    context.resetState();
    return this.responseService.getDefaultResponse(locale);
  };
}
