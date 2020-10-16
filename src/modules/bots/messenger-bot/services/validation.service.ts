import { Injectable } from '@nestjs/common';
import { isAfter, isValid, parseISO } from 'date-fns';
import {
  ACTIVITY_TYPES,
  MIN_REMAINING_VACANCIES,
} from 'modules/activity/activity.constants';
import { SKIPPED_QUICK_REPLY_PAYLOADS } from 'modules/bots/messenger-bot/messenger-bot.constants';
import { State } from 'modules/state/state.dto';
import { StateService } from 'modules/state/state.service';
import { parse } from 'querystring';
import { ResponseService } from './response.service';

@Injectable()
export class ValidationService {
  private readonly LOCATION_STATES: string[] = [
    this.stateService.states.initialize_activity,
    this.stateService.states.user_location,
  ];

  constructor(
    private readonly responseService: ResponseService,
    private readonly stateService: StateService,
  ) {}

  validateLocation = (coordinates: number[]): boolean =>
    coordinates.some(
      (coordinate: number): boolean =>
        Number.isNaN(coordinate) || Math.sign(coordinate) !== 1,
    );

  validateMessage = async (message: any, state: State, locale: string) => {
    const { quick_reply, text } = message;

    if (!state || !state.current_state) {
      if (
        quick_reply?.payload &&
        SKIPPED_QUICK_REPLY_PAYLOADS.includes(quick_reply.payload)
      )
        return;
      else {
        return this.responseService.getDefaultResponse(locale);
      }
    }

    if (state.current_state === this.stateService.states.activity_type) {
      const { activity_type } = parse(quick_reply?.payload);
      if (
        !activity_type ||
        !ACTIVITY_TYPES.hasOwnProperty(activity_type.toString())
      ) {
        return this.responseService.getInvalidActivityTypeResponse(locale);
      }
    }

    if (
      state.current_state === this.stateService.states.datetime &&
      (!isValid(parseISO(text)) || !isAfter(new Date(text), new Date()))
    ) {
      return this.responseService.getDatetimeQuestionI18n(locale);
    }

    if (
      state.current_state === this.stateService.states.price &&
      (Number.isNaN(text) || Math.sign(+text) !== 1)
    ) {
      return this.responseService.getInvalidPriceResponse(locale);
    }

    if (state.current_state === this.stateService.states.location) {
      return this.responseService.getInvalidLocationResponse(locale);
    }

    if (this.LOCATION_STATES.includes(state.current_state)) {
      return this.responseService.getInvalidUserLocationResponse(locale);
    }
  };

  validateRemainingVacancies = async (
    text: number,
    locale: string,
  ): Promise<string> => {
    if (!Number.isInteger(text) || text <= MIN_REMAINING_VACANCIES) {
      return this.responseService.getInvalidRemainingVacanciesResponse(locale);
    }
  };
}