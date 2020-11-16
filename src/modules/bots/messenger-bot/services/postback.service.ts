import { parse } from 'querystring';
import { MessengerContext } from 'bottender';
import { Injectable } from '@nestjs/common';
import {
  ACCEPT_PARTICIPATION_TYPE,
  ACTIVITY_OPTIONS_TYPE,
  ADD_REMAINING_VACANCIES_TYPE,
  APPLY_FOR_ACTIVITY_TYPE,
  CANCEL_ACCEPTED_PARTICIPATION_TYPE,
  CANCEL_ACTIVITY_TYPE,
  CANCEL_PENDING_PARTICIPATION_TYPE,
  CREATED_ACTIVITIES_TYPE,
  JOINED_ACTIVITIES_TYPE,
  ORGANIZER_TYPE,
  PARTICIPANT_LIST_TYPE,
  RECEIVED_PARTICIPATION_REQUESTS_TYPE,
  REJECT_PARTICIPATION_TYPE,
  RESET_REMAINING_VACANCIES_TYPE,
  SENT_PARTICIPATION_REQUESTS_TYPE,
  SUBTRACT_REMAINING_VACANCIES_TYPE,
  UPCOMING_ACTIVITIES_TYPE,
  UPDATE_REMAINING_VACANCIES_TYPE,
  USER_LOCATION_TYPE,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { BotUserService } from 'modules/bot-user/user.service';
import { ResolverService } from './resolver.service';
import { ResponseService } from './response.service';

@Injectable()
export class PostbackService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly resolverService: ResolverService,
    private readonly userService: BotUserService,
  ) {}

  handlePostback = async (context: MessengerContext) => {
    const {
      _session: {
        user: { id: userId },
      },
    } = context;
    const { gender, locale } = await this.userService.getUser(userId);
    const {
      activity_id,
      participation_id,
      type,
      page,
      user_id,
      latitude,
      longitude,
    } = parse(context.event.postback.payload);
    if (type !== USER_LOCATION_TYPE) {
      context.resetState();
    }
    switch (type) {
      case ACCEPT_PARTICIPATION_TYPE:
        return this.resolverService.acceptParticipation(
          participation_id.toString(),
          userId,
          locale,
        );
      case ACTIVITY_OPTIONS_TYPE: {
        return this.responseService.getActivityOptionsResponse(
          activity_id.toString(),
          locale,
        );
      }
      case ADD_REMAINING_VACANCIES_TYPE: {
        return this.resolverService.addRemainingVacancies(
          activity_id.toString(),
          userId,
          locale,
        );
      }
      case APPLY_FOR_ACTIVITY_TYPE: {
        return this.resolverService.applyForActivity(
          activity_id.toString(),
          userId,
          { gender, locale },
        );
      }
      case CANCEL_ACCEPTED_PARTICIPATION_TYPE: {
        return this.resolverService.cancelParticipation(
          type,
          activity_id.toString(),
          userId,
          { gender, locale },
        );
      }
      case CANCEL_ACTIVITY_TYPE: {
        return this.resolverService.cancelActivity(
          activity_id.toString(),
          userId,
          locale,
        );
      }
      case CANCEL_PENDING_PARTICIPATION_TYPE: {
        return this.resolverService.cancelParticipation(
          type,
          activity_id.toString(),
          userId,
          { gender, locale },
        );
      }
      case CREATED_ACTIVITIES_TYPE: {
        return this.resolverService.getCreatedActivities(userId, +page);
      }
      case JOINED_ACTIVITIES_TYPE: {
        return this.resolverService.getJoinedActivities(userId, +page);
      }
      case ORGANIZER_TYPE: {
        return this.resolverService.getOrganizer(+user_id);
      }
      case PARTICIPANT_LIST_TYPE: {
        return this.resolverService.getParticipantList(
          activity_id.toString(),
          locale,
        );
      }
      case RECEIVED_PARTICIPATION_REQUESTS_TYPE:
        return this.resolverService.getReceivedParticipationRequestList(
          userId,
          +page,
        );
      case REJECT_PARTICIPATION_TYPE:
        return this.resolverService.rejectParticipation(
          participation_id.toString(),
          userId,
          locale,
        );
      case RESET_REMAINING_VACANCIES_TYPE: {
        return this.resolverService.resetRemainingVacancies(
          activity_id.toString(),
          userId,
          locale,
        );
      }
      case SENT_PARTICIPATION_REQUESTS_TYPE:
        return this.resolverService.getSentParticipationRequestList(
          userId,
          +page,
        );
      case SUBTRACT_REMAINING_VACANCIES_TYPE: {
        return this.resolverService.subtractRemainingVacancies(
          activity_id.toString(),
          userId,
          locale,
        );
      }
      case UPCOMING_ACTIVITIES_TYPE: {
        return this.resolverService.getUpcomingActivities(context, +page);
      }
      case UPDATE_REMAINING_VACANCIES_TYPE: {
        return this.resolverService.updateRemainingVacancies(
          activity_id.toString(),
          locale,
        );
      }
      case USER_LOCATION_TYPE: {
        return this.resolverService.getUserLocation(
          context,
          +latitude,
          +longitude,
          locale,
        );
      }
      default:
    }
  };
}
