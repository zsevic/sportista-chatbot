import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from 'common/dtos';
import { ACTIVITY_TYPES } from 'modules/activity/activity.constants';
import { Activity } from 'modules/activity/activity.dto';
import {
  ACTIVITY_OPTIONS_TYPE,
  CANCEL_ACTIVITY_TYPE,
  CANCEL_PARTICIPATION_TYPE,
  CREATED_ACTIVITIES_TYPE,
  JOINED_ACTIVITIES_TYPE,
  JOIN_ACTIVITY_TYPE,
  PARTICIPANT_LIST_TYPE,
  UPCOMING_ACTIVITIES_TYPE,
  UPDATE_REMAINING_VACANCIES_TYPE,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { messages, states } from 'modules/state/state.constants';
import { User } from 'modules/user/user.dto';
import {
  ACTIVITY_OPTIONS_TEXT,
  CANCEL_TEXT,
  INVALID_ACTIVITY_TYPE_TEXT,
  JOIN_ACTIVITY_TEXT,
  NO_CREATED_ACTIVITIES_TEXT,
  NO_JOINED_ACTIVITIES_TEXT,
  NO_PARTICIPANTS_TEXT,
  NO_REMAINING_VACANCIES_TEXT,
  NO_UPCOMING_ACTIVITIES_TEXT,
  OPTIONS_TEXT,
  PARTICIPANT_LIST_TEXT,
  UPDATED_REMAINING_VACANCIES_TEXT,
  UPDATE_REMAINING_VACANCIES_TEXT,
  VIEW_MORE_CREATED_ACTIVITIES_TEXT,
  VIEW_MORE_JOINED_ACTIVITIES_TEXT,
  VIEW_MORE_UPCOMING_ACTIVITIES_TEXT,
} from './messenger-bot.texts';
import {
  getActivitiesResponse,
  getElementFromUser,
  getRemainingVacanciesButtons,
} from './messenger-bot.utils';

@Injectable()
export class MessengerBotResponses {
  getActivityOptionsResponse = (activityId: string) => ({
    text: ACTIVITY_OPTIONS_TEXT,
    buttons: [
      {
        type: 'postback',
        title: CANCEL_TEXT,
        payload: `type=${CANCEL_ACTIVITY_TYPE}&activity_id=${activityId}`,
      },
      {
        type: 'postback',
        title: PARTICIPANT_LIST_TEXT,
        payload: `type=${PARTICIPANT_LIST_TYPE}&activity_id=${activityId}`,
      },
      {
        type: 'postback',
        title: UPDATE_REMAINING_VACANCIES_TEXT,
        payload: `type=${UPDATE_REMAINING_VACANCIES_TYPE}&activity_id=${activityId}`,
      },
    ],
  });

  getCreatedActivitiesResponse = (
    activityListData: PaginatedResponse<Activity>,
  ) =>
    getActivitiesResponse({
      activityListData,
      noActivitiesText: NO_CREATED_ACTIVITIES_TEXT,
      activityTypeText: OPTIONS_TEXT,
      activityType: ACTIVITY_OPTIONS_TYPE,
      viewMoreActivitiesText: VIEW_MORE_CREATED_ACTIVITIES_TEXT,
      buttonPayloadActivityType: CREATED_ACTIVITIES_TYPE,
      isOrganizerShown: false,
    });

  getInitializeActivityResponse = () => ({
    text: messages[states.type],
    quickReplies: Object.keys(ACTIVITY_TYPES),
  });

  getInvalidActivityTypeResponse = () => ({
    text: INVALID_ACTIVITY_TYPE_TEXT,
    quickReplies: Object.keys(ACTIVITY_TYPES),
  });

  getJoinedActivitiesResponse = (
    activityListData: PaginatedResponse<Activity>,
  ) =>
    getActivitiesResponse({
      activityListData,
      noActivitiesText: NO_JOINED_ACTIVITIES_TEXT,
      activityTypeText: CANCEL_TEXT,
      activityType: CANCEL_PARTICIPATION_TYPE,
      viewMoreActivitiesText: VIEW_MORE_JOINED_ACTIVITIES_TEXT,
      buttonPayloadActivityType: JOINED_ACTIVITIES_TYPE,
      isOrganizerShown: true,
    });

  getOrganizerResponse = (organizer: User) => {
    const elements = [getElementFromUser(organizer)];

    const response = [{ cards: elements }];

    return response;
  };

  getParticipantListResponse = (participantList: User[]) => {
    if (participantList.length === 0) return NO_PARTICIPANTS_TEXT;

    const elements = participantList.map((participant: User) =>
      getElementFromUser(participant),
    );
    const response = [{ cards: elements }];

    return response;
  };

  getUpcomingActivitiesResponse = (
    activityListData: PaginatedResponse<Activity>,
  ) =>
    getActivitiesResponse({
      activityListData,
      noActivitiesText: NO_UPCOMING_ACTIVITIES_TEXT,
      activityTypeText: JOIN_ACTIVITY_TEXT,
      activityType: JOIN_ACTIVITY_TYPE,
      viewMoreActivitiesText: VIEW_MORE_UPCOMING_ACTIVITIES_TEXT,
      buttonPayloadActivityType: UPCOMING_ACTIVITIES_TYPE,
      isOrganizerShown: true,
    });

  getUpdatedRemainingVacanciesResponse = (activity: Activity) => {
    if (!activity || activity.remaining_vacancies === 0)
      return NO_REMAINING_VACANCIES_TEXT;

    return {
      text: `${UPDATED_REMAINING_VACANCIES_TEXT} ${activity.remaining_vacancies}`,
      buttons: getRemainingVacanciesButtons(activity.id),
    };
  };

  getUpdateRemainingVacanciesResponse = (activityId: string) => ({
    text: UPDATE_REMAINING_VACANCIES_TEXT,
    buttons: getRemainingVacanciesButtons(activityId),
  });
}
