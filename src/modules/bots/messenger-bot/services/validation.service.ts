import { parse } from 'querystring';
import { Injectable } from '@nestjs/common';
import { MessengerContext } from 'bottender';
import { isAfter, isValid, parseISO } from 'date-fns';
import {
  ACTIVITY_TYPES,
  MIN_REMAINING_VACANCIES,
} from 'modules/activity/activity.constants';
import { states } from 'modules/bots/messenger-bot/messenger-bot.states';
import { ValidationResponse } from 'modules/bots/messenger-bot/messenger-bot.types';
import { ResponseService } from './response.service';

@Injectable()
export class ValidationService {
  private readonly LOCATION_STATES: string[] = [
    states.initialize_activity,
    states.get_upcoming_activities,
  ];

  constructor(private readonly responseService: ResponseService) {}

  validateLocation = (coordinates: number[]): boolean =>
    coordinates.some(
      (coordinate: number): boolean =>
        Number.isNaN(coordinate) || Math.sign(coordinate) !== 1,
    );

  validateMessage = (
    context: MessengerContext,
    locale: string,
  ): ValidationResponse => {
    const {
      event: { quickReply, text },
      state: { current_state: currentState },
    } = context;

    if (!currentState) {
      return this.responseService.getDefaultResponse(locale);
    }

    if (currentState === states.activity_type) {
      const { activity_type } = parse(quickReply?.payload);
      if (
        !activity_type ||
        !ACTIVITY_TYPES.hasOwnProperty(activity_type.toString())
      ) {
        return this.responseService.getInvalidActivityTypeResponse(locale);
      }
    }

    if (
      currentState === states.activity_datetime &&
      (!isValid(parseISO(text)) || !isAfter(new Date(text), new Date()))
    ) {
      return this.responseService.getDatetimeQuestionI18n(locale);
    }

    if (
      currentState === states.activity_price &&
      (Number.isNaN(text) || Math.sign(+text) !== 1)
    ) {
      return this.responseService.getInvalidPriceResponse(locale);
    }

    if (currentState === states.activity_location) {
      return this.responseService.getInvalidLocationResponse(locale);
    }

    if (this.LOCATION_STATES.includes(currentState)) {
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
