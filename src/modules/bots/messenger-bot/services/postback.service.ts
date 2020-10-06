import { Injectable } from '@nestjs/common';
import { parse } from 'querystring';
import {
  ACTIVITY_OPTIONS_TYPE,
  ADD_REMAINING_VACANCIES_TYPE,
  CANCEL_ACTIVITY_TYPE,
  CANCEL_PARTICIPATION_TYPE,
  CREATED_ACTIVITIES_TYPE,
  GET_STARTED_PAYLOAD,
  INITIALIZE_ACTIVITY_PAYLOAD,
  JOINED_ACTIVITIES_TYPE,
  JOIN_ACTIVITY_TYPE,
  ORGANIZER_TYPE,
  PARTICIPANT_LIST_TYPE,
  RESET_REMAINING_VACANCIES_TYPE,
  SUBTRACT_REMAINING_VACANCIES_TYPE,
  UPCOMING_ACTIVITIES_TYPE,
  UPDATE_REMAINING_VACANCIES_TYPE,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { MessengerBotResponses } from 'modules/bots/messenger-bot/messenger-bot.responses';
import { MessengerBotResolver } from 'modules/bots/messenger-bot/messenger-bot.resolver';

@Injectable()
export class PostbackService {
  constructor(
    private readonly responses: MessengerBotResponses,
    private readonly resolver: MessengerBotResolver,
  ) {}

  handlePostback = async (buttonPayload: string, userId: number) => {
    const SKIP_PAYLOADS = [GET_STARTED_PAYLOAD, INITIALIZE_ACTIVITY_PAYLOAD];

    if (SKIP_PAYLOADS.includes(buttonPayload)) return;
    await this.resolver.resetState(userId);

    const { activity_id, type, page, user_id } = parse(buttonPayload);
    switch (type) {
      case ADD_REMAINING_VACANCIES_TYPE: {
        return this.resolver.addRemainingVacancies(
          activity_id.toString(),
          userId,
        );
      }
      case CANCEL_ACTIVITY_TYPE: {
        return this.resolver.cancelActivity(activity_id.toString(), userId);
      }
      case CANCEL_PARTICIPATION_TYPE: {
        return this.resolver.cancelParticipation(
          activity_id.toString(),
          userId,
        );
      }
      case CREATED_ACTIVITIES_TYPE: {
        return this.resolver.getCreatedActivities(userId, +page);
      }
      case ACTIVITY_OPTIONS_TYPE: {
        return this.responses.getActivityOptionsResponse(
          activity_id.toString(),
        );
      }
      case JOIN_ACTIVITY_TYPE: {
        return this.resolver.joinActivity(activity_id.toString(), userId);
      }
      case JOINED_ACTIVITIES_TYPE: {
        return this.resolver.getJoinedActivities(userId, +page);
      }
      case ORGANIZER_TYPE: {
        return this.resolver.getOrganizer(+user_id);
      }
      case PARTICIPANT_LIST_TYPE: {
        return this.resolver.getParticipantList(activity_id.toString());
      }
      case RESET_REMAINING_VACANCIES_TYPE: {
        return this.resolver.resetRemainingVacancies(
          activity_id.toString(),
          userId,
        );
      }
      case SUBTRACT_REMAINING_VACANCIES_TYPE: {
        return this.resolver.subtractRemainingVacancies(
          activity_id.toString(),
          userId,
        );
      }
      case UPCOMING_ACTIVITIES_TYPE: {
        return this.resolver.getUpcomingActivities(userId, +page);
      }
      case UPDATE_REMAINING_VACANCIES_TYPE: {
        return this.responses.getUpdateRemainingVacanciesResponse(
          activity_id.toString(),
        );
      }
      default:
    }
  };
}
