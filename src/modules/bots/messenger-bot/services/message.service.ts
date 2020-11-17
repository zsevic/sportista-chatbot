import { parse } from 'querystring';
import { Injectable } from '@nestjs/common';
import { MessengerContext } from 'bottender';
import { getUserOptions } from 'common/utils';
import {
  nextStates,
  notificationSubscriptionStates,
  states,
} from 'modules/bots/messenger-bot/messenger-bot.states';
import { BotUserService } from 'modules/bot-user/user.service';
import { ResolverService } from './resolver.service';
import { ResponseService } from './response.service';
import { ValidationService } from './validation.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly resolverService: ResolverService,
    private readonly userService: BotUserService,
    private readonly validationService: ValidationService,
  ) {}

  handleMessage = async (context: MessengerContext): Promise<any> => {
    const userOptions = getUserOptions(context);
    const {
      id: organizerId,
      locale,
      timezone,
    } = await this.userService.getUser(userOptions);

    let validationResponse = this.validationService.validateMessage(
      context,
      locale,
    );
    if (validationResponse) return validationResponse;

    const { text } = context.event;
    const {
      state: { current_state: currentState },
    } = context;
    if (currentState === states.initialize_feedback) {
      return this.resolverService.createFeedback(context, locale);
    }
    if (notificationSubscriptionStates.includes(currentState)) {
      return this.responseService.getNotificationSubscriptionFailureResponse(
        locale,
      );
    }

    const updatedState = {
      activity: {
        ...context.state.activity,
        ...(currentState === states.activity_datetime && {
          datetime: text,
        }),
        ...(currentState === states.activity_price && {
          price: +text,
        }),
        ...(currentState === states.activity_remaining_vacancies && {
          remaining_vacancies: +text,
        }),
        ...(currentState === states.activity_type && {
          type: parse(
            context.event.quickReply.payload,
          ).activity_type.toString(),
        }),
      },
      current_state: nextStates[currentState] || null,
    };

    if (updatedState.current_state === states.create_activity_closing) {
      validationResponse = await this.validationService.validateRemainingVacancies(
        +text,
        locale,
      );
      if (validationResponse) return validationResponse;

      return this.resolverService.createActivity(context, organizerId, locale);
    }

    context.setState(updatedState);
    const response = this.responseService.getUpdateStateResponse(
      updatedState.current_state,
      locale,
    );
    if (currentState === states.activity_datetime) {
      const datetimeConfirmationResponse = this.responseService.getDatetimeConfirmationResponse(
        text,
        { locale, timezone },
      );
      return [datetimeConfirmationResponse, ...response];
    }

    return response;
  };
}
