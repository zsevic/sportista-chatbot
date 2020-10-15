import { parse } from 'querystring';
import { Injectable } from '@nestjs/common';
import { isAfter, isValid, parseISO } from 'date-fns';
import {
  ACTIVITY_TYPES,
  MIN_REMAINING_VACANCIES,
} from 'modules/activity/activity.constants';
import { SKIPPED_QUICK_REPLY_PAYLOADS } from 'modules/bots/messenger-bot/messenger-bot.constants';
import { State } from 'modules/state/state.dto';
import { StateService } from 'modules/state/state.service';
import { UserService } from 'modules/user/user.service';
import { ResolverService } from './resolver.service';
import { ResponseService } from './response.service';
import { FIRST_PAGE } from 'common/config/constants';

@Injectable()
export class MessageService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly resolverService: ResolverService,
    private readonly stateService: StateService,
    private readonly userService: UserService,
  ) {}

  handleMessage = async (message: any, userId: number) => {
    const state = await this.resolverService.getCurrentState(userId);
    const locale = await this.userService.getLocale(userId);

    let validationResponse: any = await this.validateMessage(
      message,
      state,
      locale,
    );
    if (validationResponse) return validationResponse;

    const { text } = message;
    const updatedState = {
      [state.current_state]: text,
      ...(state.current_state === this.stateService.states.price && {
        price_value: +text,
      }),
      ...(state.current_state ===
        this.stateService.states.remaining_vacancies && {
        remaining_vacancies: +text,
      }),
      ...(state.current_state === this.stateService.states.activity_type && {
        activity_type: parse(
          message.quick_reply.payload,
        ).activity_type.toString(),
      }),
      current_state: this.stateService.nextStates[state.current_state] || null,
    };

    if (updatedState.current_state === this.stateService.states.closing) {
      validationResponse = await this.validateRemainingVacancies(+text, locale);
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

      return this.resolverService.createActivity(newActivity, locale);
    }

    const response = await this.resolverService.updateState(
      userId,
      updatedState,
      locale,
    );
    if (state.current_state === this.stateService.states.datetime) {
      const datetimeConfirmationResponse = await this.responseService.getDatetimeConfirmationResponse(
        text,
        locale,
      );
      return [datetimeConfirmationResponse, response];
    }

    return response;
  };

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

    if (state.current_state === this.stateService.states.user_location) {
      try {
        const [latitude, longitude] = text.split(',');
        const validationResponse = this.validateLocation([
          +latitude,
          +longitude,
        ]);
        if (validationResponse) {
          return this.responseService.getInvalidUserLocationResponse(locale);
        }

        await this.userService.createLocation(
          state.user_id,
          +latitude,
          +longitude,
        );
        return this.resolverService.getUpcomingActivities(
          state.user_id,
          FIRST_PAGE,
        );
      } catch {
        return this.responseService.getInvalidUserLocationResponse(locale);
      }
    }
  };

  validateLocation = (coordinates: number[]): boolean =>
    coordinates.some(
      (coordinate: number): boolean =>
        Number.isNaN(coordinate) || Math.sign(coordinate) !== 1,
    );

  validateRemainingVacancies = async (
    text: number,
    locale: string,
  ): Promise<string> => {
    if (!Number.isInteger(text) || text <= MIN_REMAINING_VACANCIES) {
      return this.responseService.getInvalidRemainingVacanciesResponse(locale);
    }
  };
}
