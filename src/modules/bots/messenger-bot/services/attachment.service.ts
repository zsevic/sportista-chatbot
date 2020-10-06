import { Injectable } from '@nestjs/common';
import { DEFAULT_ANSWER } from 'modules/bots/messenger-bot/messenger-bot.constants';
import { MessengerBotResolver } from 'modules/bots/messenger-bot/messenger-bot.resolver';
import { nextStates, states } from 'modules/state/state.constants';

@Injectable()
export class AttachmentService {
  constructor(private readonly resolver: MessengerBotResolver) {}

  handleAttachment = async (message: any, userId: number) => {
    const { type, title } = message.attachments[0];

    const state = await this.resolver.getCurrentState(userId);
    if (!state || !state.current_state) {
      return DEFAULT_ANSWER;
    }

    if (type === 'location' && state.current_state === states.location) {
      const {
        coordinates: { lat, long },
      } = message.attachments[0].payload;

      const updatedState = {
        location_title: title,
        location_latitude: lat,
        location_longitude: long,
        current_state: nextStates[state.current_state] || null,
      };

      return this.resolver.updateState(userId, updatedState);
    }
  };
}
