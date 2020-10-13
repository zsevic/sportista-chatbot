import { Injectable } from '@nestjs/common';
import { StateService } from 'modules/state/state.service';
import { UserService } from 'modules/user/user.service';
import { ResolverService } from './resolver.service';

@Injectable()
export class AttachmentService {
  constructor(
    private readonly resolverService: ResolverService,
    private readonly stateService: StateService,
    private readonly userService: UserService,
  ) {}

  handleAttachment = async (message: any, userId: number) => {
    const { type, title } = message.attachments[0];
    const locale = await this.userService.getLocale(userId);

    const state = await this.resolverService.getCurrentState(userId);
    if (!state || !state.current_state) {
      return this.resolverService.getDefaultResponse(locale);
    }

    if (
      type === 'location' &&
      state.current_state === this.stateService.states.location
    ) {
      const {
        coordinates: { lat, long },
      } = message.attachments[0].payload;

      const updatedState = {
        location_title: title,
        location_latitude: lat,
        location_longitude: long,
        current_state:
          this.stateService.nextStates[state.current_state] || null,
      };

      return this.resolverService.updateState(userId, updatedState, locale);
    }
  };
}
