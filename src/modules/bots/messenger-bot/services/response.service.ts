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
  ACTIVITY_CANCEL_ACTIVITY_SUCCESS,
  ACTIVITY_JOIN_ACTIVITY_FAILURE,
  ACTIVITY_NO_PARTICIPANTS,
  ACTIVITY_NO_REMAINING_VACANCIES,
  ACTIVITY_NOTIFY_PARTICIPANTS,
  ACTIVITY_OPTIONS,
  ACTIVITY_OPTIONS_TYPE,
  ACTIVITY_RESET_REMAINING_VACANCIES,
  ACTIVITY_TYPE_QUESTION,
  ACTIVITY_UPDATE_REMAINING_VACANCIES_FAILURE,
  ACTIVITY_UPDATED_REMAINING_VACANCIES,
  ACTIVITY_VIEW_MORE,
  ADD_REMAINING_VACANCIES,
  ADD_REMAINING_VACANCIES_TYPE,
  APPLY_FOR_ACTIVITY,
  APPLY_FOR_ACTIVITY_TYPE,
  BOT_CREATE_FEEDBACK,
  BOT_DEFAULT_MESSAGE,
  BOT_INITIALIZE_FEEDBACK,
  BOT_NOTIFICATION_SUBSCRIPTION_FAILURE,
  CANCEL_ACTIVITY,
  CANCEL_ACTIVITY_TYPE,
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
  JOIN_ACTIVITY_SUCCESS,
  LOCATION,
  LOCATION_INSTRUCTION,
  LOCATION_QUESTION,
  NOTIFY_ORGANIZER,
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
  PARTICIPATION_CANCEL_PARTICIPATION_FAILURE,
  PARTICIPATION_NO_RECEIVED_REQUESTS,
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
  USER_UPDATE_USER_LOCATION_SUCCESS,
  VIEW_MORE_CREATED_ACTIVITIES,
  VIEW_MORE_JOINED_ACTIVITIES,
  VIEW_MORE_UPCOMING_ACTIVITIES,
  SUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD,
  UNSUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD,
  USER_SUBSCRIBE_TO_NOTIFICATIONS_FAILURE,
  USER_SUBSCRIBE_TO_NOTIFICATIONS_SUCCESS,
  USER_UNSUBSCRIBE_TO_NOTIFICATIONS_SUCCESS,
  USER_UNSUBSCRIBE_TO_NOTIFICATIONS_FAILURE,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import {
  I18n,
  I18nOptions,
} from 'modules/bots/messenger-bot/messenger-bot.types';
import {
  getImageUrl,
  getLocationUrl,
} from 'modules/bots/messenger-bot/messenger-bot.utils';
import { I18N_OPTIONS_FACTORY } from 'modules/external/i18n';
import { Participation } from 'modules/participation/participation.dto';
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

  getAboutMeResponse = (locale: string): string[] => {
    const { bot: botI18n } = this.i18nService.getCatalog(locale);

    return [botI18n[ABOUT_ME_1], botI18n[ABOUT_ME_2]].map(
      (phrase: string): string =>
        this.i18nService.__(
          {
            phrase,
            locale,
          },
          {
            projectName: PROJECT_NAME,
          },
        ),
    );
  };

  getActivityOptionsResponse = (activityId: string, locale: string) => {
    const { activity: activityI18n } = this.i18nService.getCatalog(locale);

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

  private getActivitiesResponse({
    activityListData,
    activityTypeText = null,
    activityType = null,
    noActivitiesText,
    viewMoreActivitiesText,
    buttonPayloadActivityType,
    isOrganizerShown,
    options,
  }) {
    const { locale } = options;
    const { results, page, total } = activityListData;

    if (results.length === 0) return noActivitiesText;

    let cards;
    if (activityTypeText && activityType) {
      cards = this.getCardsFromActivities(
        results,
        activityTypeText,
        activityType,
        isOrganizerShown,
        options,
      );
    } else {
      cards = results.map((participation: Participation) =>
        this.getElementFromReceivedRequest(participation),
      );
    }

    const hasNextPage = PAGE_SIZE * page < total;
    const nextPage = page + 1;

    const response: any = [{ cards }];

    if (hasNextPage) {
      const viewMoreTitle = this.i18nService.__({
        phrase: ACTIVITY_VIEW_MORE,
        locale,
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

  getActivityTypeOptions = (locale: string) => {
    const { activity: activityI18n } = this.i18nService.getCatalog(locale);

    return Object.keys(ACTIVITY_TYPES).map((type) => ({
      title: `${type} ${activityI18n[type]}`,
      payload: `type=activity_type&activity_type=${type}`,
    }));
  };

  getCancelActivitySuccessResponse = (locale: string): string =>
    this.i18nService.__({ phrase: ACTIVITY_CANCEL_ACTIVITY_SUCCESS, locale });

  getCancelActivityFailureResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: ACTIVITY_CANCEL_ACTIVITY_FAILURE,
      locale,
    });

  getCancelParticipationFailureResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: PARTICIPATION_CANCEL_PARTICIPATION_FAILURE,
      locale,
    });

  getCancelParticipationSuccessResponse = (options: I18nOptions): string[] => {
    const {
      activity: activityI18n,
      participation: { CANCEL_PARTICIPATION_SUCCESS: phrase },
    } = this.i18nService.getCatalog(options.locale);

    return [
      this.i18nService.__mf(
        {
          phrase,
          locale: options.locale,
        },
        {
          GENDER: options.gender,
        },
      ),
      activityI18n[NOTIFY_ORGANIZER],
    ];
  };

  private getCardsFromActivities = (
    activities: Activity[],
    buttonTitle: string,
    payloadType: string,
    isOrganizerShown: boolean,
    options: DatetimeOptions,
  ) =>
    activities.map((activity: Activity) =>
      this.getElementFromActivity({
        activity,
        buttonTitle,
        buttonPayload: `type=${payloadType}&activity_id=${activity.id}`,
        isOrganizerShown,
        options,
      }),
    );

  getCreateActivityResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: STATE_CREATE_ACTIVITY_CLOSING,
      locale,
    });

  getCreateFeedbackResponse = (locale: string): string =>
    this.i18nService.__({ phrase: BOT_CREATE_FEEDBACK, locale });

  getCreatedActivitiesResponse = (
    activityListData: PaginatedResponse<Activity>,
    options: DatetimeOptions,
  ) => {
    const { activity: activityI18n } = this.i18nService.getCatalog(
      options.locale,
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
    const { locale } = datetimeOptions;

    return this.i18nService.__(
      {
        phrase: STATE_DATETIME_CONFIRMATION,
        locale,
      },
      {
        datetime: formattedDatetime,
      },
    );
  };

  getDatetimeQuestionI18n = (locale: string) => {
    const { state: stateI18n } = this.i18nService.getCatalog(locale);

    return this.getDatetimeQuestion(
      stateI18n[INVALID_DATETIME],
      stateI18n[DATETIME_BUTTON],
      locale,
    );
  };

  getDatetimeQuestion = (text: string, buttonTitle: string, locale: string) => {
    const url = `${this.configService.get(
      'EXTENSIONS_URL',
    )}/extensions/datetime?lang=${locale}`;

    return {
      text,
      buttons: [
        {
          type: 'web_url',
          title: buttonTitle,
          url,
          messenger_extensions: true,
          webview_height_ratio: 'compact',
          webview_share_button: 'hide',
        },
      ],
    };
  };

  getDefaultResponse = (locale: string) => {
    const defaultMessage = this.i18nService.__({
      phrase: BOT_DEFAULT_MESSAGE,
      locale,
    });
    const quickReplies = this.getDefaultResponseQuickReplies(locale);

    return {
      text: defaultMessage,
      quickReplies,
    };
  };

  getDefaultResponseQuickReplies = (locale: string) => {
    const { activity: activityI18n } = this.i18nService.getCatalog(locale);

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

  private getElementFromReceivedRequest(participation: Participation) {
    const {
      activity: {
        datetime,
        organizer: { locale, timezone },
        type,
        remaining_vacancies,
      },
      participant: { first_name, image_url, last_name },
    } = participation;
    const title = `${first_name} ${last_name} (fali ${remaining_vacancies} za ${type})`;
    const subtitle = formatDatetime(datetime, { locale, timezone });
    const buttons = [
      {
        type: 'postback',
        title: 'potvrdi',
        payload: 'payload',
      },
      {
        type: 'postback',
        title: 'izbriši',
        payload: 'payload',
      },
    ];

    return {
      title,
      subtitle,
      image_url,
      buttons,
    };
  }

  private getElementFromActivity({
    activity,
    buttonTitle,
    buttonPayload,
    isOrganizerShown = true,
    options,
  }) {
    const { locale } = options;
    const { activity: activityI18n } = this.i18nService.getCatalog(locale);

    const title =
      activity.remaining_vacancies > 0
        ? this.i18nService.__(
            { phrase: activityI18n[REMAINING_VACANCIES], locale },
            {
              remainingVacancies: activity.remaining_vacancies,
              type: activity.type,
            },
          )
        : this.i18nService.__(
            {
              phrase: activityI18n[NO_REMAINING_VACANCIES],
              locale,
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
      LOCALES[options.locale] || LOCALES[DEFAULT_LOCALE],
      { style: 'currency', currency: activity.price.currency_code },
    ).format(activity.price.value);

    return {
      title,
      subtitle: `${datetime}, ${activity.location.title}, ${price}`,
      ...(ACTIVITY_TYPES[activity.type] && {
        image_url: getImageUrl(ACTIVITY_TYPES[activity.type]),
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

  getInitializeActivityResponse = (locale: string) => {
    const quickReplies = this.getActivityTypeOptions(locale);
    const activityTypeMessage = this.i18nService.__({
      phrase: STATE_ACTIVITY_TYPE_QUESTION,
      locale,
    });

    return {
      text: activityTypeMessage,
      quickReplies,
    };
  };

  getInitializeFeedbackResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: BOT_INITIALIZE_FEEDBACK,
      locale,
    });

  getInvalidActivityTypeResponse = (locale: string) => {
    const quickReplies = this.getActivityTypeOptions(locale);
    const text = this.i18nService.__({
      phrase: STATE_INVALID_ACTIVITY_TYPE,
      locale,
    });

    return {
      text,
      quickReplies,
    };
  };

  getInvalidLocationResponse = (locale: string): string =>
    this.i18nService.__(
      { phrase: STATE_INVALID_LOCATION, locale },
      {
        distance: LOCATION_RADIUS_METERS / 1000,
      },
    );

  getInvalidPriceResponse = (locale: string): string =>
    this.i18nService.__({ phrase: STATE_INVALID_PRICE, locale });

  getInvalidRemainingVacanciesResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: STATE_INVALID_REMAINING_VACANCIES,
      locale,
    });

  getInvalidUserLocationResponse = (locale: string) => {
    const { user: userI18n } = this.i18nService.getCatalog(locale);

    return this.getUserLocationResponse({
      text: userI18n[INVALID_USER_LOCATION],
      buttonTitle: userI18n[USER_LOCATION_BUTTON],
      locale,
    });
  };

  getJoinActivityFailureResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: ACTIVITY_JOIN_ACTIVITY_FAILURE,
      locale,
    });

  getJoinActivitySuccessResponse = (options: I18nOptions): string[] => {
    const { activity: activityI18n } = this.i18nService.getCatalog(
      options.locale,
    );

    return [
      this.i18nService.__mf(
        { phrase: activityI18n[JOIN_ACTIVITY_SUCCESS], locale: options.locale },
        {
          GENDER: options.gender,
        },
      ),
      activityI18n[NOTIFY_ORGANIZER],
    ];
  };

  getJoinedActivitiesResponse = (
    activityListData: PaginatedResponse<Activity>,
    options: DatetimeOptions,
  ) => {
    const {
      activity: activityI18n,
      participation: { CANCEL_PARTICIPATION: activityTypeText },
    } = this.i18nService.getCatalog(options.locale);

    return this.getActivitiesResponse({
      activityListData,
      noActivitiesText: activityI18n[NO_JOINED_ACTIVITIES],
      activityTypeText,
      activityType: CANCEL_PARTICIPATION_TYPE,
      viewMoreActivitiesText: activityI18n[VIEW_MORE_JOINED_ACTIVITIES],
      buttonPayloadActivityType: JOINED_ACTIVITIES_TYPE,
      isOrganizerShown: true,
      options,
    });
  };

  getNotificationSubscriptionFailureResponse = (locale: string) =>
    this.i18nService.__({
      phrase: BOT_NOTIFICATION_SUBSCRIPTION_FAILURE,
      locale,
    });

  getNotifyParticipantsResponse = (
    locale: string,
    participantsCount: number,
  ): string =>
    this.i18nService.__mf(
      {
        phrase: ACTIVITY_NOTIFY_PARTICIPANTS,
        locale,
      },
      { COUNT: participantsCount },
    );

  getOrganizerResponse = (organizer: User) => {
    const elements = [this.getElementFromUser(organizer)];

    const response = [{ cards: elements }];

    return response;
  };

  getParticipantListResponse = (participantList: User[], locale: string) => {
    const noParticipantsMessage = this.i18nService.__({
      phrase: ACTIVITY_NO_PARTICIPANTS,
      locale,
    });
    if (participantList.length === 0) return noParticipantsMessage;

    const elements = participantList.map((participant: User) =>
      this.getElementFromUser(participant),
    );
    const response = [{ cards: elements }];

    return response;
  };

  getRegisterUserSuccessResponse = (locale: string): string =>
    this.i18nService.__({ phrase: USER_REGISTRATION_SUCCESS, locale });

  getRegisterUserFailureResponse = (locale: string) => {
    const { user: userI18n } = this.i18nService.getCatalog(locale);

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

  getResetRemainingVacanciesSuccessResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: ACTIVITY_RESET_REMAINING_VACANCIES,
      locale,
    });

  getReceivedParticipationRequestListResponse = (
    requestList: PaginatedResponse<Participation>,
    options: User,
  ) => {
    const noRequestsText = this.i18nService.__({
      phrase: PARTICIPATION_NO_RECEIVED_REQUESTS,
      locale: options.locale,
    });

    return this.getActivitiesResponse({
      activityListData: requestList,
      noActivitiesText: noRequestsText,
      viewMoreActivitiesText: 'view more',
      buttonPayloadActivityType: 'payload',
      isOrganizerShown: false,
      options,
    });
  };

  getSentParticipationRequestListResponse = (
    activityListData: PaginatedResponse<Activity>,
    options: User,
  ) => {
    const {
      activity: activityI18n,
      participation: {
        CANCEL_PARTICIPATION: activityTypeText,
        NO_SENT_REQUESTS: noActivitiesText,
      },
    } = this.i18nService.getCatalog(options.locale);

    return this.getActivitiesResponse({
      activityListData,
      noActivitiesText,
      activityTypeText,
      activityType: CANCEL_PARTICIPATION_TYPE,
      viewMoreActivitiesText: activityI18n[VIEW_MORE_JOINED_ACTIVITIES],
      buttonPayloadActivityType: JOINED_ACTIVITIES_TYPE,
      isOrganizerShown: true,
      options,
    });
  };

  getSubscribeToNotificationsFailureResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: USER_SUBSCRIBE_TO_NOTIFICATIONS_FAILURE,
      locale,
    });

  getSubscribeToNotificationsResponse = (locale: string) => {
    const { user: userI18n } = this.i18nService.getCatalog(locale);

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

  getSubscribeToNotificationsSuccessResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: USER_SUBSCRIBE_TO_NOTIFICATIONS_SUCCESS,
      locale,
    });

  getUnsubscribeToNotificationsFailureResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: USER_UNSUBSCRIBE_TO_NOTIFICATIONS_FAILURE,
      locale,
    });

  getUnsubscribeToNotificationsResponse = (locale: string) => {
    const { user: userI18n } = this.i18nService.getCatalog(locale);

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

  getUnsubscribeToNotificationsSuccessResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: USER_UNSUBSCRIBE_TO_NOTIFICATIONS_SUCCESS,
      locale,
    });

  getUpcomingActivitiesResponse = (
    activityListData: PaginatedResponse<Activity>,
    options: DatetimeOptions,
  ) => {
    const { activity: activityI18n } = this.i18nService.getCatalog(
      options.locale,
    );

    return this.getActivitiesResponse({
      activityListData,
      noActivitiesText: activityI18n[NO_UPCOMING_ACTIVITIES],
      activityTypeText: activityI18n[APPLY_FOR_ACTIVITY],
      activityType: APPLY_FOR_ACTIVITY_TYPE,
      viewMoreActivitiesText: activityI18n[VIEW_MORE_UPCOMING_ACTIVITIES],
      buttonPayloadActivityType: UPCOMING_ACTIVITIES_TYPE,
      isOrganizerShown: true,
      options,
    });
  };

  getUpdateLocationSuccessResponse = (locale: string): string =>
    this.i18nService.__({ phrase: USER_UPDATE_USER_LOCATION_SUCCESS, locale });

  getUpdateRemainingVacanciesResponse = (
    activityId: string,
    locale: string,
  ) => {
    const { activity: activityI18n } = this.i18nService.getCatalog(locale);

    return {
      text: activityI18n[UPDATE_REMAINING_VACANCIES],
      buttons: this.getRemainingVacanciesButtons(activityId, activityI18n),
    };
  };

  getUpdateRemainingVacanciesFailureResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: ACTIVITY_UPDATE_REMAINING_VACANCIES_FAILURE,
      locale,
    });

  getUpdateRemainingVacanciesSuccessResponse = (
    activity: Activity,
    locale: string,
  ) => {
    if (!activity || activity.remaining_vacancies === 0)
      return this.i18nService.__(
        { phrase: ACTIVITY_NO_REMAINING_VACANCIES, locale },
        {
          type: activity.type,
        },
      );
    const updatedRemainingVacanciesText = this.i18nService.__(
      { phrase: ACTIVITY_UPDATED_REMAINING_VACANCIES, locale },
      {
        remainingVacancies: activity.remaining_vacancies,
        type: activity.type,
      },
    );

    const { activity: activityI18n } = this.i18nService.getCatalog(locale);
    return {
      text: updatedRemainingVacanciesText,
      buttons: this.getRemainingVacanciesButtons(activity.id, activityI18n),
    };
  };

  getUpdateStateResponse = (currentState: string, locale: string) => {
    if (!this.messages[currentState]) return;

    const {
      state: stateI18n,
      bot: { MESSENGER_INFO },
    } = this.i18nService.getCatalog(locale);
    if (currentState === this.stateService.states.datetime) {
      return [
        this.getDatetimeQuestion(
          stateI18n[DATETIME_QUESTION],
          stateI18n[DATETIME_BUTTON],
          locale,
        ),
        MESSENGER_INFO,
      ];
    }
    return this.messages[currentState].map(
      (message: string): string => stateI18n[message],
    );
  };

  getUserLocationI18n = (locale: string) => {
    const { user: userI18n } = this.i18nService.getCatalog(locale);

    return this.getUserLocationResponse({
      text: userI18n[USER_LOCATION_TEXT],
      buttonTitle: userI18n[USER_LOCATION_BUTTON],
      descriptionText: userI18n[USER_LOCATION_DESCRIPTION_TEXT],
      locale,
    });
  };

  private getUserLocationResponse = ({
    text,
    buttonTitle,
    descriptionText = null,
    locale,
  }) => {
    const url = `${this.configService.get(
      'EXTENSIONS_URL',
    )}/extensions/location?lang=${locale}`;

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
            webview_share_button: 'hide',
          },
        ],
      },
    ];

    if (descriptionText) response.unshift(text);
    return response;
  };
}
