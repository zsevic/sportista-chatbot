import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { PaginatedResponse } from 'common/dtos';
import { formatDatetime } from 'common/utils';
import { ACTIVITY_TYPES } from 'modules/activity/activity.constants';
import { Activity } from 'modules/activity/activity.dto';
import {
  ACTIVITY_CANCEL_ACTIVITY_FAILURE,
  ACTIVITY_JOIN_ACTIVITY_FAILURE,
  ACTIVITY_NOTIFY_ORGANIZER,
  ACTIVITY_OPTIONS_TYPE,
  ACTIVITY_RESET_REMAINING_VACANCIES,
  ACTIVITY_TYPE_QUESTION,
  ACTIVITY_UPDATE_REMAINING_VACANCIES_FAILURE,
  CANCEL_ACTIVITY_SUCCESS,
  CANCEL_ACTIVITY_TYPE,
  CANCEL_PARTICIPATION_TYPE,
  CREATED_ACTIVITIES_TYPE,
  CREATE_ACTIVITY_CLOSING,
  DATETIME,
  DATETIME_QUESTION,
  GET_STARTED_PAYLOAD,
  JOINED_ACTIVITIES_TYPE,
  JOIN_ACTIVITY_SUCCESS,
  JOIN_ACTIVITY_TYPE,
  LOCATION_INSTRUCTION,
  LOCATION_QUESTION,
  NOTIFY_ORGANIZER,
  NOTIFY_PARTICIPANTS,
  NO_REMAINING_VACANCIES,
  PARTICIPANT_LIST_TYPE,
  PARTICIPATION_CANCEL_PARTICIPATION_FAILURE,
  PARTICIPATION_CANCEL_PARTICIPATION_SUCCESS,
  PRICE_QUESTION,
  REGISTRATION,
  REGISTRATION_FAILURE,
  REMAINING_VACANCIES_QUESTION,
  STATE_ACTIVITY_TYPE_QUESTION,
  STATE_CREATE_ACTIVITY_CLOSING,
  UPCOMING_ACTIVITIES_TYPE,
  UPDATED_REMAINING_VACANCIES,
  UPDATE_REMAINING_VACANCIES,
  UPDATE_REMAINING_VACANCIES_TYPE,
  USER_REGISTRATION_SUCCESS,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import {
  ACTIVITY_OPTIONS_TEXT,
  ACTIVITY_TYPES_TEXT,
  CANCEL_TEXT,
  DATETIME_CONFIRMATION_TEXT,
  INVALID_ACTIVITY_TYPE_TEXT,
  JOIN_ACTIVITY_TEXT,
  NO_CREATED_ACTIVITIES_TEXT,
  NO_JOINED_ACTIVITIES_TEXT,
  NO_PARTICIPANTS_TEXT,
  NO_UPCOMING_ACTIVITIES_TEXT,
  OPTIONS_TEXT,
  PARTICIPANT_LIST_TEXT,
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
    [this.stateService.states.activity_type]: [ACTIVITY_TYPE_QUESTION],
    [this.stateService.states.datetime]: [DATETIME_QUESTION, DATETIME],
    [this.stateService.states.location]: [
      LOCATION_QUESTION,
      LOCATION_INSTRUCTION,
    ],
    [this.stateService.states.price]: [PRICE_QUESTION],
    [this.stateService.states.remaining_vacancies]: [
      REMAINING_VACANCIES_QUESTION,
    ],
    [this.stateService.states.closing]: [CREATE_ACTIVITY_CLOSING],
  };

  constructor(
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService,
    private readonly stateService: StateService,
  ) {}

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

  getActivityTypeQuestion = async (lang: string) =>
    Object.keys(ACTIVITY_TYPES).map((type) => ({
      title: `${type} ${ACTIVITY_TYPES_TEXT[type]}`,
      payload: `type=activity_type&activity_type=${type}`,
    }));

  getCancelActivitySuccessResponse = async (
    lang: string,
  ): Promise<string[]> => {
    const activityI18n = await this.i18nService.translate('activity', {
      lang,
    });
    return [
      activityI18n[CANCEL_ACTIVITY_SUCCESS],
      activityI18n[NOTIFY_PARTICIPANTS],
    ];
  };

  getCancelActivityFailureResponse = async (lang: string): Promise<string> =>
    this.i18nService.translate(ACTIVITY_CANCEL_ACTIVITY_FAILURE, { lang });

  getCancelParticipationFailureResponse = async (
    lang: string,
  ): Promise<string> =>
    this.i18nService.translate(PARTICIPATION_CANCEL_PARTICIPATION_FAILURE, {
      lang,
    });

  getCancelParticipationSuccessResponse = async (
    lang: string,
  ): Promise<string[]> => {
    const cancelParticipationSuccessMessage = await this.i18nService.translate(
      PARTICIPATION_CANCEL_PARTICIPATION_SUCCESS,
      {
        lang,
      },
    );
    const notifyOrganizerMessage = await this.i18nService.translate(
      ACTIVITY_NOTIFY_ORGANIZER,
      {
        lang,
      },
    );
    return [cancelParticipationSuccessMessage, notifyOrganizerMessage];
  };

  getCreateActivityResponse = async (lang: string): Promise<string> =>
    this.i18nService.translate(STATE_CREATE_ACTIVITY_CLOSING, { lang });

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

  getDatetimeConfirmationResponse = (datetime: string): string => {
    const formattedDatetime = formatDatetime(datetime);

    return `${DATETIME_CONFIRMATION_TEXT} ${formattedDatetime}`;
  };

  getInitializeActivityResponse = async (lang: string) => {
    const quickReplies = await this.getActivityTypeQuestion(lang);
    const activityTypeMessage = await this.i18nService.translate(
      STATE_ACTIVITY_TYPE_QUESTION,
      {
        lang,
      },
    );

    return {
      text: activityTypeMessage,
      quickReplies,
    };
  };

  getInvalidActivityTypeResponse = async (lang: string) => {
    const quickReplies = await this.getActivityTypeQuestion(lang);

    return {
      text: INVALID_ACTIVITY_TYPE_TEXT,
      quickReplies,
    };
  };

  getJoinActivityFailureResponse = async (lang: string): Promise<string> => {
    return this.i18nService.translate(ACTIVITY_JOIN_ACTIVITY_FAILURE, {
      lang,
    });
  };

  getJoinActivitySuccessResponse = async (lang: string): Promise<string[]> => {
    const activityI18n = await this.i18nService.translate('activity', {
      lang,
    });
    return [
      activityI18n[JOIN_ACTIVITY_SUCCESS],
      activityI18n[NOTIFY_ORGANIZER],
    ];
  };

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

  getRegisterUserSuccessResponse = async (lang: string): Promise<string> => {
    return this.i18nService.translate(USER_REGISTRATION_SUCCESS, {
      lang,
    });
  };

  getRegisterUserFailureResponse = async (lang: string) => {
    const userI18n = await this.i18nService.translate('user', {
      lang,
    });

    return {
      text: userI18n[REGISTRATION_FAILURE],
      buttons: [
        {
          type: 'postback',
          title: userI18n[REGISTRATION],
          payload: GET_STARTED_PAYLOAD,
        },
      ],
    };
  };

  getResetRemainingVacanciesSuccessResponse = async (
    lang: string,
  ): Promise<string> =>
    this.i18nService.translate(ACTIVITY_RESET_REMAINING_VACANCIES, {
      lang,
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

  getUpdateRemainingVacanciesResponse = async (
    activityId: string,
    lang: string,
  ) => {
    const activityI18n = await this.i18nService.translate('activity', {
      lang,
    });
    return {
      text: activityI18n[UPDATE_REMAINING_VACANCIES],
      buttons: getRemainingVacanciesButtons(activityId, activityI18n),
    };
  };

  getUpdateRemainingVacanciesFailureResponse = async (
    lang: string,
  ): Promise<string> => {
    return this.i18nService.translate(
      ACTIVITY_UPDATE_REMAINING_VACANCIES_FAILURE,
      {
        lang,
      },
    );
  };

  getUpdateRemainingVacanciesSuccessResponse = async (
    activity: Activity,
    lang: string,
  ) => {
    const activityI18n = await this.i18nService.translate('activity', {
      lang,
    });
    if (!activity || activity.remaining_vacancies === 0)
      return activityI18n[NO_REMAINING_VACANCIES];

    return {
      text: `${activityI18n[UPDATED_REMAINING_VACANCIES]} ${activity.remaining_vacancies}`,
      buttons: getRemainingVacanciesButtons(activity.id, activityI18n),
    };
  };

  getUpdateStateResponse = async (currentState: string, lang: string) => {
    if (!this.messages[currentState]) return;

    const stateI18n = await this.i18nService.translate('state', {
      lang,
    });
    if (currentState === this.stateService.states.datetime) {
      return this.getDatetimeQuestion(
        stateI18n[DATETIME_QUESTION],
        stateI18n[DATETIME],
      );
    }
    return this.messages[currentState].map(
      (message: string): string => stateI18n[message],
    );
  };
}
