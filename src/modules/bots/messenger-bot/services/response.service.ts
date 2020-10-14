import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { I18nService } from 'nestjs-i18n';
import { PaginatedResponse } from 'common/dtos';
import { formatDatetime } from 'common/utils';
import { ACTIVITY_TYPES } from 'modules/activity/activity.constants';
import { Activity } from 'modules/activity/activity.dto';
import {
  ACTIVITY_CANCEL_ACTIVITY_FAILURE,
  ACTIVITY_CANCEL_PARTICIPATION_FAILURE,
  ACTIVITY_JOIN_ACTIVITY_FAILURE,
  ACTIVITY_NO_PARTICIPANTS,
  ACTIVITY_OPTIONS,
  ACTIVITY_OPTIONS_TYPE,
  ACTIVITY_RESET_REMAINING_VACANCIES,
  ACTIVITY_TYPE_QUESTION,
  ACTIVITY_UPDATE_REMAINING_VACANCIES_FAILURE,
  BOT_DEFAULT_MESSAGE,
  CANCEL_ACTIVITY,
  CANCEL_ACTIVITY_SUCCESS,
  CANCEL_ACTIVITY_TYPE,
  CANCEL_PARTICIPATION,
  CANCEL_PARTICIPATION_SUCCESS,
  CANCEL_PARTICIPATION_TYPE,
  CREATED_ACTIVITIES,
  CREATED_ACTIVITIES_PAYLOAD,
  CREATED_ACTIVITIES_TYPE,
  CREATE_ACTIVITY_CLOSING,
  DATETIME,
  DATETIME_QUESTION,
  GET_STARTED_PAYLOAD,
  INITIALIZE_ACTIVITY,
  INITIALIZE_ACTIVITY_PAYLOAD,
  INVALID_DATETIME,
  JOINED_ACTIVITIES,
  JOINED_ACTIVITIES_PAYLOAD,
  JOINED_ACTIVITIES_TYPE,
  JOIN_ACTIVITY_SUCCESS,
  JOIN_ACTIVITY_TYPE,
  LOCATION_INSTRUCTION,
  LOCATION_QUESTION,
  NOTIFY_ORGANIZER,
  NOTIFY_PARTICIPANTS,
  NO_CREATED_ACTIVITIES,
  NO_JOINED_ACTIVITIES,
  NO_REMAINING_VACANCIES,
  OPTIONS,
  PARTICIPANT_LIST,
  PARTICIPANT_LIST_TYPE,
  PRICE_QUESTION,
  REGISTRATION,
  REGISTRATION_FAILURE,
  REMAINING_VACANCIES_QUESTION,
  STATE_ACTIVITY_TYPE_QUESTION,
  STATE_CREATE_ACTIVITY_CLOSING,
  STATE_DATETIME_CONFIRMATION,
  STATE_INVALID_ACTIVITY_TYPE,
  STATE_INVALID_LOCATION,
  STATE_INVALID_PRICE,
  STATE_INVALID_REMAINING_VACANCIES,
  UPCOMING_ACTIVITIES,
  UPCOMING_ACTIVITIES_PAYLOAD,
  UPCOMING_ACTIVITIES_TYPE,
  UPDATED_REMAINING_VACANCIES,
  UPDATE_REMAINING_VACANCIES,
  UPDATE_REMAINING_VACANCIES_TYPE,
  USER_REGISTRATION_SUCCESS,
  VIEW_MORE_CREATED_ACTIVITIES,
  VIEW_MORE_JOINED_ACTIVITIES,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import {
  JOIN_ACTIVITY_TEXT,
  NO_UPCOMING_ACTIVITIES_TEXT,
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

  getActivityOptionsResponse = async (activityId: string, lang: string) => {
    const activityI18n = await this.i18nService.translate('activity', { lang });
    return {
      text: activityI18n[ACTIVITY_OPTIONS],
      buttons: [
        {
          type: 'postback',
          title: activityI18n[CANCEL_ACTIVITY],
          payload: `type=${CANCEL_ACTIVITY_TYPE}&activity_id=${activityId}`,
        },
        {
          type: 'postback',
          title: activityI18n[PARTICIPANT_LIST],
          payload: `type=${PARTICIPANT_LIST_TYPE}&activity_id=${activityId}`,
        },
        {
          type: 'postback',
          title: activityI18n[UPDATE_REMAINING_VACANCIES],
          payload: `type=${UPDATE_REMAINING_VACANCIES_TYPE}&activity_id=${activityId}`,
        },
      ],
    };
  };

  getActivityTypeOptions = async (lang: string) => {
    const activityI18n = await this.i18nService.translate('activity', { lang });
    return Object.keys(ACTIVITY_TYPES).map((type) => ({
      title: `${type} ${activityI18n[type]}`,
      payload: `type=activity_type&activity_type=${type}`,
    }));
  };

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
    this.i18nService.translate(ACTIVITY_CANCEL_PARTICIPATION_FAILURE, {
      lang,
    });

  getCancelParticipationSuccessResponse = async (
    lang: string,
  ): Promise<string[]> => {
    const activityI18n = await this.i18nService.translate('activity', { lang });
    return [
      activityI18n[CANCEL_PARTICIPATION_SUCCESS],
      activityI18n[NOTIFY_ORGANIZER],
    ];
  };

  getCreateActivityResponse = async (lang: string): Promise<string> =>
    this.i18nService.translate(STATE_CREATE_ACTIVITY_CLOSING, { lang });

  getCreatedActivitiesResponse = async (
    activityListData: PaginatedResponse<Activity>,
    lang: string,
  ) => {
    const activityI18n = await this.i18nService.translate('activity', { lang });

    return getActivitiesResponse({
      activityListData,
      noActivitiesText: activityI18n[NO_CREATED_ACTIVITIES],
      activityTypeText: activityI18n[OPTIONS],
      activityType: ACTIVITY_OPTIONS_TYPE,
      viewMoreActivitiesText: activityI18n[VIEW_MORE_CREATED_ACTIVITIES],
      buttonPayloadActivityType: CREATED_ACTIVITIES_TYPE,
      isOrganizerShown: false,
    });
  };

  getDatetimeConfirmationResponse = async (
    datetime: string,
    lang: string,
  ): Promise<string> => {
    const formattedDatetime = formatDatetime(datetime, lang);
    const datetimeConfirmation = await this.i18nService.translate(
      STATE_DATETIME_CONFIRMATION,
      { lang },
    );

    return `${datetimeConfirmation} ${formattedDatetime}`;
  };

  getDatetimeQuestionI18n = async (lang: string) => {
    const stateI18n = await this.i18nService.translate('state', { lang });
    return this.getDatetimeQuestion(
      stateI18n[INVALID_DATETIME],
      stateI18n[DATETIME],
    );
  };

  getDatetimeQuestion = (text: string, buttonTitle: string) => {
    const url = `${this.configService.get(
      'EXTENSIONS_URL',
    )}/extensions/datetime`;

    return {
      text,
      buttons: [
        {
          type: 'web_url',
          title: buttonTitle,
          url,
          messenger_extensions: true,
          webview_height_ratio: 'compact',
        },
      ],
    };
  };

  getDefaultResponse = async (lang: string) => {
    const defaultMessage = await this.i18nService.translate(
      BOT_DEFAULT_MESSAGE,
      { lang },
    );
    const quickReplies = await this.getDefaultResponseQuickReplies(lang);

    return {
      text: defaultMessage,
      quickReplies,
    };
  };

  getDefaultResponseQuickReplies = async (lang: string) => {
    const activityI18n = await this.i18nService.translate('activity', { lang });

    return [
      {
        title: activityI18n[UPCOMING_ACTIVITIES],
        payload: UPCOMING_ACTIVITIES_PAYLOAD,
        content_type: 'text',
      },
      {
        title: activityI18n[JOINED_ACTIVITIES],
        payload: JOINED_ACTIVITIES_PAYLOAD,
        content_type: 'text',
      },
      {
        title: activityI18n[CREATED_ACTIVITIES],
        payload: CREATED_ACTIVITIES_PAYLOAD,
        content_type: 'text',
      },
      {
        title: activityI18n[INITIALIZE_ACTIVITY],
        payload: INITIALIZE_ACTIVITY_PAYLOAD,
        content_type: 'text',
      },
    ];
  };

  getInitializeActivityResponse = async (lang: string) => {
    const quickReplies = await this.getActivityTypeOptions(lang);
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
    const quickReplies = await this.getActivityTypeOptions(lang);
    const text = await this.i18nService.translate(STATE_INVALID_ACTIVITY_TYPE, {
      lang,
    });

    return {
      text,
      quickReplies,
    };
  };

  getInvalidLocationResponse = async (lang: string): Promise<string> =>
    this.i18nService.translate(STATE_INVALID_LOCATION, { lang });

  getInvalidPriceResponse = async (lang: string): Promise<string> =>
    this.i18nService.translate(STATE_INVALID_PRICE, { lang });

  getInvalidRemainingVacanciesResponse = async (
    lang: string,
  ): Promise<string> =>
    this.i18nService.translate(STATE_INVALID_REMAINING_VACANCIES, { lang });

  getJoinActivityFailureResponse = async (lang: string): Promise<string> =>
    this.i18nService.translate(ACTIVITY_JOIN_ACTIVITY_FAILURE, {
      lang,
    });

  getJoinActivitySuccessResponse = async (lang: string): Promise<string[]> => {
    const activityI18n = await this.i18nService.translate('activity', {
      lang,
    });
    return [
      activityI18n[JOIN_ACTIVITY_SUCCESS],
      activityI18n[NOTIFY_ORGANIZER],
    ];
  };

  getJoinedActivitiesResponse = async (
    activityListData: PaginatedResponse<Activity>,
    lang: string,
  ) => {
    const activityI18n = await this.i18nService.translate('activity', { lang });

    return getActivitiesResponse({
      activityListData,
      noActivitiesText: activityI18n[NO_JOINED_ACTIVITIES],
      activityTypeText: activityI18n[CANCEL_PARTICIPATION],
      activityType: CANCEL_PARTICIPATION_TYPE,
      viewMoreActivitiesText: activityI18n[VIEW_MORE_JOINED_ACTIVITIES],
      buttonPayloadActivityType: JOINED_ACTIVITIES_TYPE,
      isOrganizerShown: true,
    });
  };

  getOrganizerResponse = (organizer: User) => {
    const elements = [getElementFromUser(organizer)];

    const response = [{ cards: elements }];

    return response;
  };

  getParticipantListResponse = async (
    participantList: User[],
    lang: string,
  ) => {
    const noParticipantsMessage = await this.i18nService.translate(
      ACTIVITY_NO_PARTICIPANTS,
      { lang },
    );
    if (participantList.length === 0) return noParticipantsMessage;

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
