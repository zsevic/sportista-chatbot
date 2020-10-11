import { Injectable } from '@nestjs/common';
import { isAfter, isValid, parseISO } from 'date-fns';
import emojiRegex from 'emoji-regex';
import {
  ACTIVITY_TYPES,
  MIN_REMAINING_VACANCIES,
} from 'modules/activity/activity.constants';
import {
  DEFAULT_ANSWER,
  SKIPPED_QUICK_REPLY_PAYLOADS,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import {
  DATETIME_TEXT,
  INVALID_DATETIME_TEXT,
  INVALID_LOCATION_TEXT,
  INVALID_PRICE_TEXT,
  INVALID_REMAINING_VACANCIES_TEXT,
} from 'modules/bots/messenger-bot/messenger-bot.texts';
import { State } from 'modules/state/state.dto';
import { StateService } from 'modules/state/state.service';
import { ResolverService } from './resolver.service';
import { ResponseService } from './response.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly resolverService: ResolverService,
    private readonly stateService: StateService,
  ) {}

  handleMessage = async (message: any, userId: number) => {
    const state = await this.resolverService.getCurrentState(userId);

    let validationResponse = this.validateMessage(message, state);
    if (validationResponse) return validationResponse;

    const { text } = message;
    const updatedState = {
      [state.current_state]: text,
      ...(state.current_state === this.stateService.states.price && {
        price_value: +text,
      }),
      ...(state.current_state === this.stateService.states.activity_type && {
        activity_type: text[0],
      }),
      current_state: this.stateService.nextStates[state.current_state] || null,
    };

    if (updatedState.current_state === this.stateService.states.closing) {
      validationResponse = this.validateRemainingVacancies(+text);
      if (validationResponse) return validationResponse;

      const newActivity = {
        datetime: state.datetime,
        organizer_id: userId,
        location_title: state.location_title,
        location_latitude: state.location_latitude,
        location_longitude: state.location_longitude,
        price: state.price_value,
        remaining_vacancies: +text,
        type: state.activity_type,
      };

      return this.resolverService.createActivity(newActivity);
    }

    return this.resolverService.updateState(userId, updatedState);
  };

  validateMessage = (message: any, state: State) => {
    const { quick_reply, text } = message;
    if (!state || !state.current_state) {
      if (
        quick_reply?.payload &&
        SKIPPED_QUICK_REPLY_PAYLOADS.includes(quick_reply.payload)
      )
        return;
      else {
        return DEFAULT_ANSWER;
      }
    }

    if (state.current_state === this.stateService.states.activity_type) {
      const regex = emojiRegex();
      const match = regex.exec(text.slice(0, 2));
      if (!match || !ACTIVITY_TYPES.hasOwnProperty(match[0])) {
        return this.responseService.getInvalidActivityTypeResponse();
      }
    }

    if (state.current_state === this.stateService.states.location) {
      return INVALID_LOCATION_TEXT;
    }

    if (
      state.current_state === this.stateService.states.datetime &&
      (!isValid(parseISO(text)) || !isAfter(new Date(text), new Date()))
    ) {
      return this.responseService.getDatetimeQuestion(
        INVALID_DATETIME_TEXT,
        DATETIME_TEXT,
      );
    }

    if (
      state.current_state === this.stateService.states.price &&
      (Number.isNaN(text) || Math.sign(+text) !== 1)
    )
      return INVALID_PRICE_TEXT;
  };

  validateRemainingVacancies = (text: number): string => {
    if (!Number.isInteger(text) || text <= MIN_REMAINING_VACANCIES)
      return INVALID_REMAINING_VACANCIES_TEXT;
  };
}
