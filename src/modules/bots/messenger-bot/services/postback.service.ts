import { Injectable } from '@nestjs/common';
import { parse } from 'querystring';
import {
  ACTIVITY_OPTIONS_TYPE,
  ADD_REMAINING_VACANCIES_TYPE,
  APPLY_FOR_ACTIVITY_TYPE,
  CANCEL_ACTIVITY_TYPE,
  CANCEL_PARTICIPATION_TYPE,
  CREATED_ACTIVITIES_TYPE,
  JOINED_ACTIVITIES_TYPE,
  ORGANIZER_TYPE,
  PARTICIPANT_LIST_TYPE,
  RESET_REMAINING_VACANCIES_TYPE,
  SUBTRACT_REMAINING_VACANCIES_TYPE,
  UPCOMING_ACTIVITIES_TYPE,
  UPDATE_REMAINING_VACANCIES_TYPE,
  USER_LOCATION_TYPE,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { ResolverService } from './resolver.service';
import { ResponseService } from './response.service';
import { UserService } from 'modules/user/user.service';

@Injectable()
export class PostbackService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly resolverService: ResolverService,
    private readonly userService: UserService,
  ) {}

  handlePostback = async (buttonPayload: string, userId: number) => {
    const { gender, locale } = await this.userService.getUser(userId);
    const { activity_id, type, page, user_id, latitude, longitude } = parse(
      buttonPayload,
    );
    if (type !== USER_LOCATION_TYPE) {
      await this.resolverService.resetState(userId);
    }
    switch (type) {
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
      case CANCEL_ACTIVITY_TYPE: {
        return this.resolverService.cancelActivity(
          activity_id.toString(),
          userId,
          locale,
        );
      }
      case CANCEL_PARTICIPATION_TYPE: {
        return this.resolverService.cancelParticipation(
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
      case RESET_REMAINING_VACANCIES_TYPE: {
        return this.resolverService.resetRemainingVacancies(
          activity_id.toString(),
          userId,
          locale,
        );
      }
      case SUBTRACT_REMAINING_VACANCIES_TYPE: {
        return this.resolverService.subtractRemainingVacancies(
          activity_id.toString(),
          userId,
          locale,
        );
      }
      case UPCOMING_ACTIVITIES_TYPE: {
        return this.resolverService.getUpcomingActivities(userId, +page);
      }
      case UPDATE_REMAINING_VACANCIES_TYPE: {
        return this.resolverService.updateRemainingVacancies(
          activity_id.toString(),
          locale,
        );
      }
      case USER_LOCATION_TYPE: {
        return this.resolverService.getUserLocation(
          userId,
          +latitude,
          +longitude,
          locale,
        );
      }
      default:
    }
  };
}
