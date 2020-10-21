import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCATION_RADIUS_METERS,
  PAGE_SIZE,
  PROJECT_NAME,
} from 'common/config/constants';
import { PaginatedResponse } from 'common/dtos';
import { DatetimeOptions } from 'common/types';
import { formatDatetime } from 'common/utils';
import { ACTIVITY_TYPES } from 'modules/activity/activity.constants';
import { Activity } from 'modules/activity/activity.dto';
import {
  ABOUT_ME_1,
  ABOUT_ME_2,
  ACTIVITY_CANCEL_ACTIVITY_FAILURE,
  ACTIVITY_CANCEL_PARTICIPATION_FAILURE,
  ACTIVITY_JOIN_ACTIVITY_FAILURE,
  ACTIVITY_NO_PARTICIPANTS,
  ACTIVITY_OPTIONS,
  ACTIVITY_OPTIONS_TYPE,
  ACTIVITY_RESET_REMAINING_VACANCIES,
  ACTIVITY_TYPE_QUESTION,
  ACTIVITY_UPDATE_REMAINING_VACANCIES_FAILURE,
  ACTIVITY_VIEW_MORE,
  ADD_REMAINING_VACANCIES,
  ADD_REMAINING_VACANCIES_TYPE,
  BOT_DEFAULT_MESSAGE,
  BOT_INITIALIZE_FEEDBACK,
  BOT_CREATE_FEEDBACK,
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
  DATETIME_BUTTON,
  DATETIME_QUESTION,
  GET_STARTED_PAYLOAD,
  INITIALIZE_ACTIVITY,
  INITIALIZE_ACTIVITY_PAYLOAD,
  INVALID_USER_LOCATION,
  INVALID_DATETIME,
  JOINED_ACTIVITIES,
  JOINED_ACTIVITIES_PAYLOAD,
  JOINED_ACTIVITIES_TYPE,
  JOIN_ACTIVITY,
  JOIN_ACTIVITY_SUCCESS,
  JOIN_ACTIVITY_TYPE,
  LOCATION,
  LOCATION_INSTRUCTION,
  LOCATION_QUESTION,
  NOTIFY_ORGANIZER,
  NOTIFY_PARTICIPANTS,
  NO_CREATED_ACTIVITIES,
  NO_JOINED_ACTIVITIES,
  NO_REMAINING_VACANCIES,
  NO_REMAINING_VACANCIES_BUTTON,
  NO_UPCOMING_ACTIVITIES,
  OPTIONS,
  ORGANIZER,
  ORGANIZER_TYPE,
  PARTICIPANT_LIST,
  PARTICIPANT_LIST_TYPE,
  PRICE_QUESTION,
  REGISTRATION,
  REGISTRATION_FAILURE,
  REMAINING_VACANCIES,
  REMAINING_VACANCIES_QUESTION,
  RESET_REMAINING_VACANCIES_TYPE,
  STATE_ACTIVITY_TYPE_QUESTION,
  STATE_CREATE_ACTIVITY_CLOSING,
  STATE_DATETIME_CONFIRMATION,
  STATE_INVALID_ACTIVITY_TYPE,
  STATE_INVALID_LOCATION,
  STATE_INVALID_PRICE,
  STATE_INVALID_REMAINING_VACANCIES,
  SUBSCRIBE_TO_NOTIFICATIONS_BUTTON,
  SUBSCRIBE_TO_NOTIFICATIONS_TEXT,
  SUBTRACT_REMAINING_VACANCIES,
  SUBTRACT_REMAINING_VACANCIES_TYPE,
  UNSUBSCRIBE_TO_NOTIFICATIONS_BUTTON,
  UNSUBSCRIBE_TO_NOTIFICATIONS_TEXT,
  UPCOMING_ACTIVITIES,
  UPCOMING_ACTIVITIES_PAYLOAD,
  UPCOMING_ACTIVITIES_TYPE,
  UPDATE_REMAINING_VACANCIES,
  UPDATE_REMAINING_VACANCIES_TYPE,
  USER_LOCATION_BUTTON,
  USER_LOCATION_DESCRIPTION_TEXT,
  USER_LOCATION_TEXT,
  USER_REGISTRATION_SUCCESS,
  USER_UPDATE_LOCATION_SUCCESS,
  VIEW_MORE_CREATED_ACTIVITIES,
  VIEW_MORE_JOINED_ACTIVITIES,
  VIEW_MORE_UPCOMING_ACTIVITIES,
  SUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD,
  UNSUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD,
  USER_SUBSCRIBE_TO_NOTIFICATIONS_FAILURE,
  USER_SUBSCRIBE_TO_NOTIFICATIONS_SUCCESS,
  USER_UNSUBSCRIBE_TO_NOTIFICATIONS_SUCCESS,
  USER_UNSUBSCRIBE_TO_NOTIFICATIONS_FAILURE,
  BOT_NOTIFICATION_SUBSCRIPTION_FAILURE,
  ACTIVITY_NO_REMAINING_VACANCIES,
  ACTIVITY_UPDATED_REMAINING_VACANCIES,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import {
  I18n,
  I18nOptions,
} from 'modules/bots/messenger-bot/messenger-bot.types';
import { getLocationUrl } from 'modules/bots/messenger-bot/messenger-bot.utils';
import { I18N_OPTIONS_FACTORY } from 'modules/external/i18n';
import { StateService } from 'modules/state/state.service';
import { User } from 'modules/user/user.dto';

@Injectable()
export class ResponseService {
  messages: any = {
    [this.stateService.states.activity_type]: [ACTIVITY_TYPE_QUESTION],
    [this.stateService.states.datetime]: [DATETIME_QUESTION, DATETIME_BUTTON],
    [this.stateService.states.location]: [
      LOCATION_QUESTION,
      LOCATION_INSTRUCTION,
    ],
    [this.stateService.states.price]: [PRICE_QUESTION],
    [this.stateService.states.remaining_vacancies]: [
      REMAINING_VACANCIES_QUESTION,
    ],
    [this.stateService.states.create_activity_closing]: [
      CREATE_ACTIVITY_CLOSING,
    ],
  };

  constructor(
    private readonly configService: ConfigService,
    @Inject(I18N_OPTIONS_FACTORY) private readonly i18nService,
    private readonly stateService: StateService,
  ) {}

  getAboutMeResponse = (lang: string): string[] => {
    const { bot: botI18n } = this.i18nService.getCatalog(lang);

    return [botI18n[ABOUT_ME_1], botI18n[ABOUT_ME_2]].map(
      (phrase: string): string =>
        this.i18nService.__(
          {
            phrase,
            locale: lang,
          },
          {
            projectName: PROJECT_NAME,
          },
        ),
    );
  };

  getActivityOptionsResponse = (activityId: string, lang: string) => {
    const { activity: activityI18n } = this.i18nService.getCatalog(lang);

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

  private async getActivitiesResponse({
    activityListData,
    activityTypeText,
    activityType,
    noActivitiesText,
    viewMoreActivitiesText,
    buttonPayloadActivityType,
    isOrganizerShown,
    options,
  }) {
    const { lang } = options;
    const { results, page, total } = activityListData;

    if (results.length === 0) return noActivitiesText;

    const elements = results.map((activity: Activity) =>
      this.getElementFromActivity({
        activity,
        buttonTitle: activityTypeText,
        buttonPayload: `type=${activityType}&activity_id=${activity.id}`,
        isOrganizerShown,
        options,
      }),
    );
    const cards = await Promise.all(elements);

    const hasNextPage = PAGE_SIZE * page < total;
    const nextPage = page + 1;

    const response: any = [{ cards }];

    if (hasNextPage) {
      const viewMoreTitle = this.i18nService.__({
        phrase: ACTIVITY_VIEW_MORE,
        locale: lang,
      });
      response.push({
        text: viewMoreActivitiesText,
        buttons: [
          {
            type: 'postback',
            title: viewMoreTitle,
            payload: `type=${buttonPayloadActivityType}&page=${nextPage}`,
          },
        ],
      });
    }

    return response;
  }

  getActivityTypeOptions = (lang: string) => {
    const { activity: activityI18n } = this.i18nService.getCatalog(lang);

    return Object.keys(ACTIVITY_TYPES).map((type) => ({
      title: `${type} ${activityI18n[type]}`,
      payload: `type=activity_type&activity_type=${type}`,
    }));
  };

  getCancelActivitySuccessResponse = (lang: string): string[] => {
    const { activity: activityI18n } = this.i18nService.getCatalog(lang);

    return [
      activityI18n[CANCEL_ACTIVITY_SUCCESS],
      activityI18n[NOTIFY_PARTICIPANTS],
    ];
  };

  getCancelActivityFailureResponse = (lang: string): string =>
    this.i18nService.__({
      phrase: ACTIVITY_CANCEL_ACTIVITY_FAILURE,
      locale: lang,
    });

  getCancelParticipationFailureResponse = (lang: string): string =>
    this.i18nService.__({
      phrase: ACTIVITY_CANCEL_PARTICIPATION_FAILURE,
      locale: lang,
    });

  getCancelParticipationSuccessResponse = (options: I18nOptions): string[] => {
    const { activity: activityI18n } = this.i18nService.getCatalog(
      options.locale,
    );

    return [
      this.i18nService.__mf(activityI18n[CANCEL_PARTICIPATION_SUCCESS], {
        GENDER: options.gender,
      }),
      activityI18n[NOTIFY_ORGANIZER],
    ];
  };

  getCreateActivityResponse = (lang: string): string =>
    this.i18nService.__({
      phrase: STATE_CREATE_ACTIVITY_CLOSING,
      locale: lang,
    });

  getCreateFeedbackResponse = (lang: string): string =>
    this.i18nService.__({ phrase: BOT_CREATE_FEEDBACK, locale: lang });

  getCreatedActivitiesResponse = async (
    activityListData: PaginatedResponse<Activity>,
    options: DatetimeOptions,
  ) => {
    const { activity: activityI18n } = this.i18nService.getCatalog(
      options.lang,
    );

    return this.getActivitiesResponse({
      activityListData,
      noActivitiesText: activityI18n[NO_CREATED_ACTIVITIES],
      activityTypeText: activityI18n[OPTIONS],
      activityType: ACTIVITY_OPTIONS_TYPE,
      viewMoreActivitiesText: activityI18n[VIEW_MORE_CREATED_ACTIVITIES],
      buttonPayloadActivityType: CREATED_ACTIVITIES_TYPE,
      isOrganizerShown: false,
      options,
    });
  };

  getDatetimeConfirmationResponse = (
    datetime: string,
    datetimeOptions: DatetimeOptions,
  ): string => {
    const formattedDatetime = formatDatetime(datetime, datetimeOptions);
    const { lang } = datetimeOptions;

    return this.i18nService.__(
      {
        phrase: STATE_DATETIME_CONFIRMATION,
        locale: lang,
      },
      {
        datetime: formattedDatetime,
      },
    );
  };

  getDatetimeQuestionI18n = (lang: string) => {
    const { state: stateI18n } = this.i18nService.getCatalog(lang);

    return this.getDatetimeQuestion(
      stateI18n[INVALID_DATETIME],
      stateI18n[DATETIME_BUTTON],
      lang,
    );
  };

  getDatetimeQuestion = (text: string, buttonTitle: string, lang: string) => {
    const url = `${this.configService.get(
      'EXTENSIONS_URL',
    )}/extensions/datetime?lang=${lang}`;

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

  getDefaultResponse = (lang: string) => {
    const defaultMessage = this.i18nService.__({
      phrase: BOT_DEFAULT_MESSAGE,
      locale: lang,
    });
    const quickReplies = this.getDefaultResponseQuickReplies(lang);

    return {
      text: defaultMessage,
      quickReplies,
    };
  };

  getDefaultResponseQuickReplies = (lang: string) => {
    const { activity: activityI18n } = this.i18nService.getCatalog(lang);

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

  private getElementFromActivity({
    activity,
    buttonTitle,
    buttonPayload,
    isOrganizerShown = true,
    options,
  }) {
    const { activity: activityI18n } = this.i18nService.getCatalog(
      options.lang,
    );

    const title =
      activity.remaining_vacancies > 0
        ? this.i18nService.__(
            { phrase: activityI18n[REMAINING_VACANCIES], locale: options.lang },
            {
              remainingVacancies: activity.remaining_vacancies,
              type: activity.type,
            },
          )
        : this.i18nService.__(
            {
              phrase: activityI18n[NO_REMAINING_VACANCIES],
              locale: options.lang,
            },
            {
              type: activity.type,
            },
          );
    const url = getLocationUrl(
      activity.location.latitude,
      activity.location.longitude,
    );

    const buttons = [
      { type: 'postback', title: buttonTitle, payload: buttonPayload },
      { type: 'web_url', title: activityI18n[LOCATION], url },
    ];
    if (isOrganizerShown) {
      buttons.push({
        type: 'postback',
        title: activityI18n[ORGANIZER],
        payload: `type=${ORGANIZER_TYPE}&user_id=${activity.organizer_id}`,
      });
    }
    const datetime = formatDatetime(activity.datetime, options);
    const price = new Intl.NumberFormat(
      LOCALES[options.lang] || LOCALES[DEFAULT_LOCALE],
      { style: 'currency', currency: activity.price.currency_code },
    ).format(activity.price.value);

    return {
      title,
      subtitle: `${datetime}, ${activity.location.title}, ${price}`,
      ...(ACTIVITY_TYPES[activity.type] && {
        image_url: `https://loremflickr.com/320/240/${
          ACTIVITY_TYPES[activity.type]
        }`,
      }),
      buttons,
    };
  }

  private getElementFromUser(user: User) {
    return {
      title: `${user.first_name} ${user.last_name}`,
      image_url: user.image_url,
    };
  }

  getInitializeActivityResponse = (lang: string) => {
    const quickReplies = this.getActivityTypeOptions(lang);
    const activityTypeMessage = this.i18nService.__({
      phrase: STATE_ACTIVITY_TYPE_QUESTION,
      locale: lang,
    });

    return {
      text: activityTypeMessage,
      quickReplies,
    };
  };

  getInitializeFeedbackResponse = (lang: string): string =>
    this.i18nService.__({
      phrase: BOT_INITIALIZE_FEEDBACK,
      locale: lang,
    });

  getInvalidActivityTypeResponse = (lang: string) => {
    const quickReplies = this.getActivityTypeOptions(lang);
    const text = this.i18nService.__({
      phrase: STATE_INVALID_ACTIVITY_TYPE,
      locale: lang,
    });

    return {
      text,
      quickReplies,
    };
  };

  getInvalidLocationResponse = (lang: string): string =>
    this.i18nService.__(
      { phrase: STATE_INVALID_LOCATION, locale: lang },
      {
        distance: LOCATION_RADIUS_METERS / 1000,
      },
    );

  getInvalidPriceResponse = (lang: string): string =>
    this.i18nService.__({ phrase: STATE_INVALID_PRICE, locale: lang });

  getInvalidRemainingVacanciesResponse = (lang: string): string =>
    this.i18nService.__({
      phrase: STATE_INVALID_REMAINING_VACANCIES,
      locale: lang,
    });

  getInvalidUserLocationResponse = (lang: string) => {
    const { user: userI18n } = this.i18nService.getCatalog(lang);

    return this.getUserLocationResponse({
      text: userI18n[INVALID_USER_LOCATION],
      buttonTitle: userI18n[USER_LOCATION_BUTTON],
      lang,
    });
  };

  getJoinActivityFailureResponse = (lang: string): string =>
    this.i18nService.__({
      phrase: ACTIVITY_JOIN_ACTIVITY_FAILURE,
      locale: lang,
    });

  getJoinActivitySuccessResponse = (options: I18nOptions): string[] => {
    const { activity: activityI18n } = this.i18nService.getCatalog(
      options.locale,
    );

    return [
      this.i18nService.__mf(activityI18n[JOIN_ACTIVITY_SUCCESS], {
        GENDER: options.gender,
      }),
      activityI18n[NOTIFY_ORGANIZER],
    ];
  };

  getJoinedActivitiesResponse = async (
    activityListData: PaginatedResponse<Activity>,
    options: DatetimeOptions,
  ) => {
    const { activity: activityI18n } = this.i18nService.getCatalog(
      options.lang,
    );

    return this.getActivitiesResponse({
      activityListData,
      noActivitiesText: activityI18n[NO_JOINED_ACTIVITIES],
      activityTypeText: activityI18n[CANCEL_PARTICIPATION],
      activityType: CANCEL_PARTICIPATION_TYPE,
      viewMoreActivitiesText: activityI18n[VIEW_MORE_JOINED_ACTIVITIES],
      buttonPayloadActivityType: JOINED_ACTIVITIES_TYPE,
      isOrganizerShown: true,
      options,
    });
  };

  getNotificationSubscriptionFailureResponse = (lang: string) =>
    this.i18nService.__({
      phrase: BOT_NOTIFICATION_SUBSCRIPTION_FAILURE,
      locale: lang,
    });

  getOrganizerResponse = (organizer: User) => {
    const elements = [this.getElementFromUser(organizer)];

    const response = [{ cards: elements }];

    return response;
  };

  getParticipantListResponse = (participantList: User[], lang: string) => {
    const noParticipantsMessage = this.i18nService.__({
      phrase: ACTIVITY_NO_PARTICIPANTS,
      locale: lang,
    });
    if (participantList.length === 0) return noParticipantsMessage;

    const elements = participantList.map((participant: User) =>
      this.getElementFromUser(participant),
    );
    const response = [{ cards: elements }];

    return response;
  };

  getRegisterUserSuccessResponse = (lang: string): string =>
    this.i18nService.__({ phrase: USER_REGISTRATION_SUCCESS, locale: lang });

  getRegisterUserFailureResponse = (lang: string) => {
    const { user: userI18n } = this.i18nService.getCatalog(lang);

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

  private getRemainingVacanciesButtons = (
    activityId: string,
    activityI18n: I18n,
  ) => [
    {
      type: 'postback',
      title: activityI18n[ADD_REMAINING_VACANCIES],
      payload: `type=${ADD_REMAINING_VACANCIES_TYPE}&activity_id=${activityId}`,
    },
    {
      type: 'postback',
      title: activityI18n[SUBTRACT_REMAINING_VACANCIES],
      payload: `type=${SUBTRACT_REMAINING_VACANCIES_TYPE}&activity_id=${activityId}`,
    },
    {
      type: 'postback',
      title: activityI18n[NO_REMAINING_VACANCIES_BUTTON],
      payload: `type=${RESET_REMAINING_VACANCIES_TYPE}&activity_id=${activityId}`,
    },
  ];

  getResetRemainingVacanciesSuccessResponse = (lang: string): string =>
    this.i18nService.__({
      phrase: ACTIVITY_RESET_REMAINING_VACANCIES,
      locale: lang,
    });

  getSubscribeToNotificationsFailureResponse = (lang: string): string =>
    this.i18nService.__({
      phrase: USER_SUBSCRIBE_TO_NOTIFICATIONS_FAILURE,
      locale: lang,
    });

  getSubscribeToNotificationsResponse = (lang: string) => {
    const { user: userI18n } = this.i18nService.getCatalog(lang);

    return {
      text: userI18n[SUBSCRIBE_TO_NOTIFICATIONS_TEXT],
      buttons: [
        {
          type: 'postback',
          title: userI18n[SUBSCRIBE_TO_NOTIFICATIONS_BUTTON],
          payload: SUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD,
        },
      ],
    };
  };

  getSubscribeToNotificationsSuccessResponse = (lang: string): string =>
    this.i18nService.__({
      phrase: USER_SUBSCRIBE_TO_NOTIFICATIONS_SUCCESS,
      locale: lang,
    });

  getUnsubscribeToNotificationsFailureResponse = (lang: string): string =>
    this.i18nService.__({
      phrase: USER_UNSUBSCRIBE_TO_NOTIFICATIONS_FAILURE,
      locale: lang,
    });

  getUnsubscribeToNotificationsResponse = (lang: string) => {
    const { user: userI18n } = this.i18nService.getCatalog(lang);

    return {
      text: userI18n[UNSUBSCRIBE_TO_NOTIFICATIONS_TEXT],
      buttons: [
        {
          type: 'postback',
          title: userI18n[UNSUBSCRIBE_TO_NOTIFICATIONS_BUTTON],
          payload: UNSUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD,
        },
      ],
    };
  };

  getUnsubscribeToNotificationsSuccessResponse = (lang: string): string =>
    this.i18nService.__({
      phrase: USER_UNSUBSCRIBE_TO_NOTIFICATIONS_SUCCESS,
      locale: lang,
    });

  getUpcomingActivitiesResponse = async (
    activityListData: PaginatedResponse<Activity>,
    options: DatetimeOptions,
  ) => {
    const { activity: activityI18n } = this.i18nService.getCatalog(
      options.lang,
    );

    return this.getActivitiesResponse({
      activityListData,
      noActivitiesText: activityI18n[NO_UPCOMING_ACTIVITIES],
      activityTypeText: activityI18n[JOIN_ACTIVITY],
      activityType: JOIN_ACTIVITY_TYPE,
      viewMoreActivitiesText: activityI18n[VIEW_MORE_UPCOMING_ACTIVITIES],
      buttonPayloadActivityType: UPCOMING_ACTIVITIES_TYPE,
      isOrganizerShown: true,
      options,
    });
  };

  getUpdateLocationSuccessResponse = (lang: string): string =>
    this.i18nService.__({ phrase: USER_UPDATE_LOCATION_SUCCESS, locale: lang });

  getUpdateRemainingVacanciesResponse = (activityId: string, lang: string) => {
    const { activity: activityI18n } = this.i18nService.getCatalog(lang);

    return {
      text: activityI18n[UPDATE_REMAINING_VACANCIES],
      buttons: this.getRemainingVacanciesButtons(activityId, activityI18n),
    };
  };

  getUpdateRemainingVacanciesFailureResponse = (lang: string): string =>
    this.i18nService.__({
      phrase: ACTIVITY_UPDATE_REMAINING_VACANCIES_FAILURE,
      locale: lang,
    });

  getUpdateRemainingVacanciesSuccessResponse = (
    activity: Activity,
    lang: string,
  ) => {
    if (!activity || activity.remaining_vacancies === 0)
      return this.i18nService.__(
        { phrase: ACTIVITY_NO_REMAINING_VACANCIES, locale: lang },
        {
          type: activity.type,
        },
      );
    const updatedRemainingVacanciesText = this.i18nService.__(
      { phrase: ACTIVITY_UPDATED_REMAINING_VACANCIES, locale: lang },
      {
        remainingVacancies: activity.remaining_vacancies,
        type: activity.type,
      },
    );

    const { activity: activityI18n } = this.i18nService.getCatalog(lang);
    return {
      text: updatedRemainingVacanciesText,
      buttons: this.getRemainingVacanciesButtons(activity.id, activityI18n),
    };
  };

  getUpdateStateResponse = (currentState: string, lang: string) => {
    if (!this.messages[currentState]) return;

    const { state: stateI18n } = this.i18nService.getCatalog(lang);
    if (currentState === this.stateService.states.datetime) {
      return this.getDatetimeQuestion(
        stateI18n[DATETIME_QUESTION],
        stateI18n[DATETIME_BUTTON],
        lang,
      );
    }
    return this.messages[currentState].map(
      (message: string): string => stateI18n[message],
    );
  };

  getUserLocationI18n = (lang: string) => {
    const { user: userI18n } = this.i18nService.getCatalog(lang);

    return this.getUserLocationResponse({
      text: userI18n[USER_LOCATION_TEXT],
      buttonTitle: userI18n[USER_LOCATION_BUTTON],
      descriptionText: userI18n[USER_LOCATION_DESCRIPTION_TEXT],
      lang,
    });
  };

  private getUserLocationResponse = ({
    text,
    buttonTitle,
    descriptionText = null,
    lang,
  }) => {
    const url = `${this.configService.get(
      'EXTENSIONS_URL',
    )}/extensions/location?lang=${lang}`;

    const response: any = [
      {
        text: descriptionText ? descriptionText : text,
        buttons: [
          {
            type: 'web_url',
            title: buttonTitle,
            url,
            messenger_extensions: true,
            webview_height_ratio: 'compact',
          },
        ],
      },
    ];

    if (descriptionText) response.unshift(text);
    return response;
  };
}
