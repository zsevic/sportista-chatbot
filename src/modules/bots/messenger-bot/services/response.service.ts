import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessengerTypes } from 'bottender';
import {
  DEFAULT_MESSENGER_LOCALE,
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
  ACCEPT_PARTICIPATION_TYPE,
  ACTIVITY_ACTIVITY_APPLICATION_FAILURE,
  ACTIVITY_APPLICATION_SUCCESS,
  ACTIVITY_CANCEL_ACTIVITY_FAILURE,
  ACTIVITY_CANCEL_ACTIVITY_SUCCESS,
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
  CANCEL_ACCEPTED_PARTICIPATION_TYPE,
  CANCEL_ACTIVITY,
  CANCEL_ACTIVITY_TYPE,
  CANCEL_PENDING_PARTICIPATION_TYPE,
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
  LOCATION,
  LOCATION_INSTRUCTION,
  LOCATION_QUESTION,
  NOTIFY_ORGANIZER_ABOUT_APPLICATION,
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
  PARTICIPATION_ACCEPT_PARTICIPATION_SUCCESS,
  PARTICIPATION_ACCEPT_PARTICIPATION_FAILURE,
  PARTICIPATION_CANCEL_PARTICIPATION_FAILURE,
  PARTICIPATION_REJECT_PARTICIPATION_FAILURE,
  PARTICIPATION_REJECT_PARTICIPATION_SUCCESS,
  PRICE_QUESTION,
  RECEIVED_PARTICIPATION_REQUESTS_TYPE,
  REGISTRATION,
  REGISTRATION_FAILURE,
  REJECT_PARTICIPATION_TYPE,
  REMAINING_VACANCIES,
  REMAINING_VACANCIES_QUESTION,
  RESET_REMAINING_VACANCIES_TYPE,
  SENT_PARTICIPATION_REQUESTS_TYPE,
  STATE_ACTIVITY_TYPE_QUESTION,
  STATE_CREATE_ACTIVITY_CLOSING,
  STATE_DATETIME_CONFIRMATION,
  STATE_INVALID_ACTIVITY_TYPE,
  STATE_INVALID_LOCATION,
  STATE_INVALID_PRICE,
  STATE_INVALID_REMAINING_VACANCIES,
  SUBSCRIBE_TO_NOTIFICATIONS_BUTTON,
  SUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD,
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
  UNSUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD,
  USER_SUBSCRIBE_TO_NOTIFICATIONS_FAILURE,
  USER_SUBSCRIBE_TO_NOTIFICATIONS_SUCCESS,
  USER_UNSUBSCRIBE_TO_NOTIFICATIONS_SUCCESS,
  USER_UNSUBSCRIBE_TO_NOTIFICATIONS_FAILURE,
} from 'modules/bots/messenger-bot/messenger-bot.constants';
import { states } from 'modules/bots/messenger-bot/messenger-bot.states';
import {
  ButtonTemplate,
  Button,
  GenericTemplate,
  I18n,
  I18nOptions,
  ResponseServiceMessages,
} from 'modules/bots/messenger-bot/messenger-bot.types';
import {
  getImageUrl,
  getLocationUrl,
} from 'modules/bots/messenger-bot/messenger-bot.utils';
import { I18N_OPTIONS_FACTORY } from 'modules/external/i18n';
import { Participation } from 'modules/participation/participation.dto';
import { BotUser } from 'modules/bot-user/user.dto';

@Injectable()
export class ResponseService {
  messages: ResponseServiceMessages = {
    [states.activity_type]: [ACTIVITY_TYPE_QUESTION],
    [states.activity_datetime]: [DATETIME_QUESTION, DATETIME_BUTTON],
    [states.activity_location]: [LOCATION_QUESTION, LOCATION_INSTRUCTION],
    [states.activity_price]: [PRICE_QUESTION],
    [states.activity_remaining_vacancies]: [REMAINING_VACANCIES_QUESTION],
    [states.create_activity_closing]: [CREATE_ACTIVITY_CLOSING],
  };

  constructor(
    private readonly configService: ConfigService,
    @Inject(I18N_OPTIONS_FACTORY) private readonly i18nService,
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

  getAcceptParticipationFailureResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: PARTICIPATION_ACCEPT_PARTICIPATION_FAILURE,
      locale,
    });

  getAcceptParticipationSuccessResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: PARTICIPATION_ACCEPT_PARTICIPATION_SUCCESS,
      locale,
    });

  getActivityOptionsResponse = (
    activityId: string,
    locale: string,
  ): ButtonTemplate => {
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
    viewMorePayloadType,
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

    const response: Array<GenericTemplate | ButtonTemplate> = [{ cards }];

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
            payload: `type=${viewMorePayloadType}&page=${nextPage}`,
          },
        ],
      });
    }

    return response;
  }

  getActivityTypeOptions = (locale: string): MessengerTypes.QuickReply[] => {
    const { activity: activityI18n } = this.i18nService.getCatalog(locale);

    return Object.keys(ACTIVITY_TYPES).map((type) => ({
      contentType: 'text',
      title: `${type} ${activityI18n[type]}`,
      payload: `type=activity_type&activity_type=${type}`,
    }));
  };

  getApplyForActivityFailureResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: ACTIVITY_ACTIVITY_APPLICATION_FAILURE,
      locale,
    });

  getApplyForActivitySuccessResponse = (options: I18nOptions): string[] => {
    const { activity: activityI18n } = this.i18nService.getCatalog(
      options.locale,
    );

    return [
      this.i18nService.__mf(
        {
          phrase: activityI18n[ACTIVITY_APPLICATION_SUCCESS],
          locale: options.locale,
        },
        {
          GENDER: options.gender,
        },
      ),
      activityI18n[NOTIFY_ORGANIZER_ABOUT_APPLICATION],
    ];
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
      viewMorePayloadType: CREATED_ACTIVITIES_TYPE,
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

  getDatetimeQuestionI18n = (locale: string): Button<ButtonTemplate> => {
    const { state: stateI18n } = this.i18nService.getCatalog(locale);

    return this.getDatetimeQuestion(
      stateI18n[INVALID_DATETIME],
      stateI18n[DATETIME_BUTTON],
      locale,
    );
  };

  getDatetimeQuestion = (
    text: string,
    buttonTitle: string,
    locale: string,
  ): Button<ButtonTemplate> => {
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
          webviewHeightRatio: 'compact',
          messengerExtensions: true,
          webviewShareButton: 'hide',
        },
      ],
    };
  };

  getDefaultResponse = (locale: string): MessengerTypes.TextMessage => {
    const text = this.i18nService.__({
      phrase: BOT_DEFAULT_MESSAGE,
      locale,
    });
    const quickReplies = this.getDefaultResponseQuickReplies(locale);

    return {
      text,
      quickReplies,
    };
  };

  getDefaultResponseQuickReplies = (
    locale: string,
  ): MessengerTypes.QuickReply[] => {
    const { activity: activityI18n } = this.i18nService.getCatalog(locale);

    return [
      {
        title: activityI18n[UPCOMING_ACTIVITIES],
        payload: UPCOMING_ACTIVITIES_PAYLOAD,
        contentType: 'text',
      },
      {
        title: activityI18n[INITIALIZE_ACTIVITY],
        payload: INITIALIZE_ACTIVITY_PAYLOAD,
        contentType: 'text',
      },
      {
        title: activityI18n[JOINED_ACTIVITIES],
        payload: JOINED_ACTIVITIES_PAYLOAD,
        contentType: 'text',
      },
      {
        title: activityI18n[CREATED_ACTIVITIES],
        payload: CREATED_ACTIVITIES_PAYLOAD,
        contentType: 'text',
      },
    ];
  };

  private getElementFromReceivedRequest(participation: Participation) {
    const {
      id: participationId,
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
    const {
      participation: {
        ACCEPT_PARTICIPATION: acceptParticipationTitle,
        REJECT_PARTICIPATION: rejectParticipationTitle,
      },
    } = this.i18nService.getCatalog(locale);
    const buttons = [
      {
        type: 'postback',
        title: acceptParticipationTitle,
        payload: `type=${ACCEPT_PARTICIPATION_TYPE}&participation_id=${participationId}`,
      },
      {
        type: 'postback',
        title: rejectParticipationTitle,
        payload: `type=${REJECT_PARTICIPATION_TYPE}&participation_id=${participationId}`,
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
      LOCALES[options.locale] || LOCALES[DEFAULT_MESSENGER_LOCALE],
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

  private getElementFromUser(user: BotUser) {
    return {
      title: `${user.first_name} ${user.last_name}`,
      image_url: user.image_url,
    };
  }

  getInitializeActivityResponse = (
    locale: string,
  ): MessengerTypes.TextMessage => {
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

  getInvalidActivityTypeResponse = (
    locale: string,
  ): MessengerTypes.TextMessage => {
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

  getInvalidUserLocationResponse = (
    locale: string,
  ): Button<ButtonTemplate>[] => {
    const { user: userI18n } = this.i18nService.getCatalog(locale);

    return this.getUserLocationResponse({
      text: userI18n[INVALID_USER_LOCATION],
      buttonTitle: userI18n[USER_LOCATION_BUTTON],
      locale,
    });
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
      activityType: CANCEL_ACCEPTED_PARTICIPATION_TYPE,
      viewMoreActivitiesText: activityI18n[VIEW_MORE_JOINED_ACTIVITIES],
      viewMorePayloadType: JOINED_ACTIVITIES_TYPE,
      isOrganizerShown: true,
      options,
    });
  };

  getNotificationSubscriptionFailureResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: BOT_NOTIFICATION_SUBSCRIPTION_FAILURE,
      locale,
    });

  getNotifyParticipantsResponse = (
    locale: string,
    participantCount: number,
  ): string =>
    this.i18nService.__mf(
      {
        phrase: ACTIVITY_NOTIFY_PARTICIPANTS,
        locale,
      },
      { COUNT: participantCount },
    );

  getOrganizerResponse = (organizer: BotUser) => {
    const elements = [this.getElementFromUser(organizer)];

    const response = [{ cards: elements }];

    return response;
  };

  getParticipantListResponse = (participantList: BotUser[], locale: string) => {
    const noParticipantsMessage = this.i18nService.__({
      phrase: ACTIVITY_NO_PARTICIPANTS,
      locale,
    });
    if (participantList.length === 0) return noParticipantsMessage;

    const elements = participantList.map((participant: BotUser) =>
      this.getElementFromUser(participant),
    );
    const response = [{ cards: elements }];

    return response;
  };

  getRegisterUserSuccessResponse = (
    locale: string,
  ): MessengerTypes.TextMessage => {
    const text = this.i18nService.__({
      phrase: USER_REGISTRATION_SUCCESS,
      locale,
    });

    const quickReplies = this.getDefaultResponseQuickReplies(locale);

    return {
      text,
      quickReplies,
    };
  };

  getRegisterUserFailureResponse = (locale: string): ButtonTemplate => {
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

  getRejectParticipationFailureResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: PARTICIPATION_REJECT_PARTICIPATION_FAILURE,
      locale,
    });

  getRejectParticipationSuccessResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: PARTICIPATION_REJECT_PARTICIPATION_SUCCESS,
      locale,
    });

  private getRemainingVacanciesButtons = (
    activityId: string,
    activityI18n: I18n,
  ): MessengerTypes.TemplateButton[] => [
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
    options: BotUser,
  ) => {
    const {
      participation: {
        NO_RECEIVED_REQUESTS: noActivitiesText,
        VIEW_MORE_RECEIVED_REQUESTS: viewMoreActivitiesText,
      },
    } = this.i18nService.getCatalog(options.locale);

    return this.getActivitiesResponse({
      activityListData: requestList,
      noActivitiesText,
      viewMoreActivitiesText,
      viewMorePayloadType: RECEIVED_PARTICIPATION_REQUESTS_TYPE,
      isOrganizerShown: false,
      options,
    });
  };

  getSentParticipationRequestListResponse = (
    activityListData: PaginatedResponse<Activity>,
    options: BotUser,
  ) => {
    const {
      participation: {
        CANCEL_PARTICIPATION: activityTypeText,
        NO_SENT_REQUESTS: noActivitiesText,
        VIEW_MORE_SENT_REQUESTS: viewMoreActivitiesText,
      },
    } = this.i18nService.getCatalog(options.locale);

    return this.getActivitiesResponse({
      activityListData,
      noActivitiesText,
      activityTypeText,
      activityType: CANCEL_PENDING_PARTICIPATION_TYPE,
      viewMoreActivitiesText,
      viewMorePayloadType: SENT_PARTICIPATION_REQUESTS_TYPE,
      isOrganizerShown: true,
      options,
    });
  };

  getSubscribeToNotificationsFailureResponse = (locale: string): string =>
    this.i18nService.__({
      phrase: USER_SUBSCRIBE_TO_NOTIFICATIONS_FAILURE,
      locale,
    });

  getSubscribeToNotificationsResponse = (locale: string): ButtonTemplate => {
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

  getUnsubscribeToNotificationsResponse = (locale: string): ButtonTemplate => {
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
      viewMorePayloadType: UPCOMING_ACTIVITIES_TYPE,
      isOrganizerShown: true,
      options,
    });
  };

  getUpdateLocationSuccessResponse = (locale: string): string =>
    this.i18nService.__({ phrase: USER_UPDATE_USER_LOCATION_SUCCESS, locale });

  getUpdateRemainingVacanciesResponse = (
    activityId: string,
    locale: string,
  ): ButtonTemplate => {
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
  ): ButtonTemplate => {
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
    if (currentState === states.activity_datetime) {
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

  getUserLocationI18n = (locale: string): Button<ButtonTemplate>[] => {
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
  }): Button<ButtonTemplate>[] => {
    const url = `${this.configService.get(
      'EXTENSIONS_URL',
    )}/extensions/location?lang=${locale}`;

    const response: Button<ButtonTemplate>[] = [
      {
        text: descriptionText ? descriptionText : text,
        buttons: [
          {
            type: 'web_url',
            title: buttonTitle,
            url,
            webviewHeightRatio: 'compact',
            messengerExtensions: true,
            webviewShareButton: 'hide',
          },
        ],
      },
    ];

    if (descriptionText) response.unshift(text);
    return response;
  };
}
