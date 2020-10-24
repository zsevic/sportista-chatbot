import { parse } from 'querystring';
import { Injectable } from '@nestjs/common';
import { StateService } from 'modules/state/state.service';
import { UserService } from 'modules/user/user.service';
import { ResolverService } from './resolver.service';
import { ResponseService } from './response.service';
import { ValidationService } from './validation.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly resolverService: ResolverService,
    private readonly stateService: StateService,
    private readonly userService: UserService,
    private readonly validationService: ValidationService,
  ) {}

  handleMessage = async (message: any, userId: number) => {
    const state = await this.resolverService.getCurrentState(userId);
    const { locale, timezone } = await this.userService.getUser(userId);

    let validationResponse: any = await this.validationService.validateMessage(
      message,
      state,
      locale,
    );
    if (validationResponse) return validationResponse;

    const { text } = message;
    if (state.current_state === this.stateService.states.initialize_feedback) {
      return this.resolverService.createFeedback(
        {
          user_id: userId,
          text,
        },
        locale,
      );
    }
    if (
      this.stateService.notificationSubscriptionStates.includes(
        state.current_state,
      )
    ) {
      return this.responseService.getNotificationSubscriptionFailureResponse(
        locale,
      );
    }

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

    if (
      updatedState.current_state ===
      this.stateService.states.create_activity_closing
    ) {
      validationResponse = await this.validationService.validateRemainingVacancies(
        +text,
        locale,
      );
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
        { locale, timezone },
      );
      return [datetimeConfirmationResponse, response];
    }

    return response;
  };
}
