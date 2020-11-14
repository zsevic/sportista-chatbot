import { Injectable } from '@nestjs/common';
import { ActivityService } from 'modules/activity/activity.service';
import { ResponseService } from 'modules/bots/messenger-bot/services/response.service';
import { Location } from 'modules/bots/messenger-bot/messenger-bot.types';
import { StateService } from 'modules/state/state.service';
import { UserService } from 'modules/user/user.service';
import { ResolverService } from './resolver.service';
import { PINNED_LOCATION } from 'modules/location/location.constants';

@Injectable()
export class LocationService {
  constructor(
    private readonly activityService: ActivityService,
    private readonly resolverService: ResolverService,
    private readonly responseService: ResponseService,
    private readonly stateService: StateService,
    private readonly userService: UserService,
  ) {}

  handleLocation = async (message: Location, userId: number): Promise<any> => {
    const locale = await this.userService.getLocale(userId);

    const state = await this.resolverService.getCurrentState(userId);
    if (!state || !state.current_state) {
      return this.resolverService.getDefaultResponse(locale);
    }

    if (state.current_state === this.stateService.states.location) {
      const {
        coordinates: { lat, long },
      } = message;

      const isValidLocation = await this.activityService.validateLocation(
        userId,
        lat,
        long,
      );
      if (!isValidLocation)
        return this.responseService.getInvalidLocationResponse(locale);

      const updatedState = {
        location_title: PINNED_LOCATION,
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
