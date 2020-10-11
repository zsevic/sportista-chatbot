import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginatedResponse } from 'common/dtos';
import { ACTIVITY_TYPES } from 'modules/activity/activity.constants';
import { Activity } from 'modules/activity/activity.dto';
import {
  ACTIVITY_OPTIONS_TYPE,
  CANCEL_ACTIVITY_TYPE,
  CANCEL_PARTICIPATION_TYPE,
  CREATED_ACTIVITIES_TYPE,
  GET_STARTED_PAYLOAD,
  JOINED_ACTIVITIES_TYPE,
  JOIN_ACTIVITY_TYPE,
  PARTICIPANT_LIST_TYPE,
  UPCOMING_ACTIVITIES_TYPE,
  UPDATE_REMAINING_VACANCIES_TYPE,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import {
  ACTIVITY_OPTIONS_TEXT,
  ACTIVITY_TYPES_TEXT,
  ACTIVITY_TYPE_QUESTION_TEXT,
  CANCEL_TEXT,
  CREATE_ACTIVITY_CLOSING_TEXT,
  DATETIME_QUESTION_TEXT,
  DATETIME_TEXT,
  INVALID_ACTIVITY_TYPE_TEXT,
  JOIN_ACTIVITY_TEXT,
  LOCATION_INSTRUCTION_TEXT,
  LOCATION_QUESTION_TEXT,
  NO_CREATED_ACTIVITIES_TEXT,
  NO_JOINED_ACTIVITIES_TEXT,
  NO_PARTICIPANTS_TEXT,
  NO_REMAINING_VACANCIES_TEXT,
  NO_UPCOMING_ACTIVITIES_TEXT,
  OPTIONS_TEXT,
  PARTICIPANT_LIST_TEXT,
  PRICE_QUESTION_TEXT,
  REGISTRATION_FAILURE_TEXT,
  REGISTRATION_TEXT,
  REMAINING_VACANCIES_QUESTION_TEXT,
  UPDATED_REMAINING_VACANCIES_TEXT,
  UPDATE_REMAINING_VACANCIES_TEXT,
  VIEW_MORE_CREATED_ACTIVITIES_TEXT,
  VIEW_MORE_JOINED_ACTIVITIES_TEXT,
  VIEW_MORE_UPCOMING_ACTIVITIES_TEXT,
} from 'modules/bots/messenger-bot/messenger-bot.texts';
import {
  getActivitiesResponse,
  getElementFromUser,
  getRemainingVacanciesButtons,
} from 'modules/bots/messenger-bot/messenger-bot.utils';
import { StateService } from 'modules/state/state.service';
import { User } from 'modules/user/user.dto';

@Injectable()
export class ResponseService {
  messages: any = {
    [this.stateService.states.activity_type]: ACTIVITY_TYPE_QUESTION_TEXT,
    [this.stateService.states.location]: [
      LOCATION_QUESTION_TEXT,
      LOCATION_INSTRUCTION_TEXT,
    ],
    [this.stateService.states.price]: PRICE_QUESTION_TEXT,
    [this.stateService.states
      .remaining_vacancies]: REMAINING_VACANCIES_QUESTION_TEXT,
    [this.stateService.states.closing]: CREATE_ACTIVITY_CLOSING_TEXT,
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly stateService: StateService,
  ) {
    this.messages[this.stateService.states.datetime] = this.getDatetimeQuestion(
      DATETIME_QUESTION_TEXT,
      DATETIME_TEXT,
    );
  }

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

  getActivityTypeQuestion = () =>
    Object.keys(ACTIVITY_TYPES).map((type) => ({
      title: `${type} ${ACTIVITY_TYPES_TEXT[type]}`,
      payload: `type=activity_type&activity_type=${type}`,
    }));

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

  getDatetimeQuestion = (text: string, title: string) => {
    const url = `${this.configService.get(
      'EXTENSIONS_URL',
    )}/extensions/datetime`;

    return {
      text,
      buttons: [
        {
          type: 'web_url',
          title,
          url,
          messenger_extensions: true,
          webview_height_ratio: 'compact',
        },
      ],
    };
  };

  getInitializeActivityResponse = () => ({
    text: this.messages[this.stateService.states.activity_type],
    quickReplies: this.getActivityTypeQuestion(),
  });

  getInvalidActivityTypeResponse = () => ({
    text: INVALID_ACTIVITY_TYPE_TEXT,
    quickReplies: this.getActivityTypeQuestion(),
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

  getRegistrationFailureResponse = async () => ({
    text: REGISTRATION_FAILURE_TEXT,
    buttons: [
      {
        type: 'postback',
        title: REGISTRATION_TEXT,
        payload: GET_STARTED_PAYLOAD,
      },
    ],
  });

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
