import { PROJECT_NAME } from 'common/config/constants';
import activityI18nEn from 'i18n/en/activity.json';
import activityI18nSr from 'i18n/sr/activity.json';

export const CREATED_ACTIVITIES_PAYLOAD = 'CREATED_ACTIVITIES_PAYLOAD';
export const INITIALIZE_ACTIVITY_PAYLOAD = 'INITIALIZE_ACTIVITY_PAYLOAD';
export const JOINED_ACTIVITIES_PAYLOAD = 'JOINED_ACTIVITIES_PAYLOAD';
export const UPCOMING_ACTIVITIES_PAYLOAD = 'UPCOMING_ACTIVITIES_PAYLOAD';
export const GET_STARTED_PAYLOAD = 'BOOTBOT_GET_STARTED';

export const ADD_REMAINING_VACANCIES_TYPE = 'ADD_REMAINING_VACANCIES_TYPE';
export const RESET_REMAINING_VACANCIES_TYPE = 'RESET_REMAINING_VACANCIES_TYPE';
export const SUBTRACT_REMAINING_VACANCIES_TYPE =
  'SUBTRACT_REMAINING_VACANCIES_TYPE';
export const UPDATE_REMAINING_VACANCIES_TYPE =
  'UPDATE_REMAINING_VACANCIES_TYPE';

export const CANCEL_ACTIVITY_TYPE = 'CANCEL_ACTIVITY_TYPE';
export const CANCEL_PARTICIPATION_TYPE = 'CANCEL_PARTICIPATION_TYPE';
export const CREATED_ACTIVITIES_TYPE = 'CREATED_ACTIVITIES_TYPE';
export const ACTIVITY_OPTIONS_TYPE = 'ACTIVITY_OPTIONS_TYPE';
export const JOINED_ACTIVITIES_TYPE = 'JOINED_ACTIVITIES_TYPE';
export const JOIN_ACTIVITY_TYPE = 'JOIN_ACTIVITY_TYPE';
export const ORGANIZER_TYPE = 'ORGANIZER_TYPE';
export const PARTICIPANT_LIST_TYPE = 'PARTICIPANT_LIST_TYPE';
export const UPCOMING_ACTIVITIES_TYPE = 'UPCOMING_ACTIVITIES_TYPE';

const DEFAULT_LOCALE = 'default';
const ENGLISH_LOCALE = 'en_GB';
export const GREETING_TEXT = [
  {
    locale: ENGLISH_LOCALE,
    text: `Hi! With ${PROJECT_NAME} you can find missing players or join some game`,
  },
  {
    locale: DEFAULT_LOCALE,
    text: `Zdravo! ${PROJECT_NAME} ti pomaže da lakše nađeš igrače ili da se pridružiš timu u zakazanom terminu!`,
  },
];

export const FIRST_PAGE = 1;
export const PAGE_SIZE = 10;

export const SKIPPED_POSTBACK_PAYLOADS = [
  GET_STARTED_PAYLOAD,
  INITIALIZE_ACTIVITY_PAYLOAD,
];

export const SKIPPED_QUICK_REPLY_PAYLOADS = [
  CREATED_ACTIVITIES_PAYLOAD,
  INITIALIZE_ACTIVITY_PAYLOAD,
  JOINED_ACTIVITIES_PAYLOAD,
  UPCOMING_ACTIVITIES_PAYLOAD,
];

const CANCEL_ACTIVITY_FAILURE = 'CANCEL_ACTIVITY_FAILURE';
export const ACTIVITY_CANCEL_ACTIVITY_FAILURE = `activity.${CANCEL_ACTIVITY_FAILURE}`;
const CANCEL_PARTICIPATION_FAILURE = 'CANCEL_PARTICIPATION_FAILURE';
export const ACTIVITY_CANCEL_PARTICIPATION_FAILURE = `activity.${CANCEL_PARTICIPATION_FAILURE}`;
const JOIN_ACTIVITY_FAILURE = 'JOIN_ACTIVITY_FAILURE';
export const ACTIVITY_JOIN_ACTIVITY_FAILURE = `activity.${JOIN_ACTIVITY_FAILURE}`;
export const ACTIVITY_OPTIONS = 'ACTIVITY_OPTIONS';
const NO_PARTICIPANTS = 'NO_PARTICIPANTS';
export const ACTIVITY_NO_PARTICIPANTS = `activity.${NO_PARTICIPANTS}`;
const RESET_REMAINING_VACANCIES = 'RESET_REMAINING_VACANCIES';
export const ACTIVITY_RESET_REMAINING_VACANCIES = `activity.${RESET_REMAINING_VACANCIES}`;
export const UPDATE_REMAINING_VACANCIES_FAILURE =
  'UPDATE_REMAINING_VACANCIES_FAILURE';
export const ACTIVITY_UPDATE_REMAINING_VACANCIES_FAILURE = `activity.${UPDATE_REMAINING_VACANCIES_FAILURE}`;
export const ADD_REMAINING_VACANCIES = 'ADD_REMAINING_VACANCIES';
export const CANCEL_ACTIVITY = 'CANCEL_ACTIVITY';
export const CANCEL_ACTIVITY_SUCCESS = 'CANCEL_ACTIVITY_SUCCESS';
export const CANCEL_PARTICIPATION_SUCCESS = 'CANCEL_PARTICIPATION_SUCCESS';
export const CREATED_ACTIVITIES = 'CREATED_ACTIVITIES';
export const INITIALIZE_ACTIVITY = 'INITIALIZE_ACTIVITY';
export const JOIN_ACTIVITY_SUCCESS = 'JOIN_ACTIVITY_SUCCESS';
export const JOINED_ACTIVITIES = 'JOINED_ACTIVITIES';
export const NO_CREATED_ACTIVITIES = 'NO_CREATED_ACTIVITIES';
export const NO_REMAINING_VACANCIES = 'NO_REMAINING_VACANCIES';
export const NOTIFY_ORGANIZER = 'NOTIFY_ORGANIZER';
export const NOTIFY_PARTICIPANTS = 'NOTIFY_PARTICIPANTS';
export const OPTIONS = 'OPTIONS';
export const PARTICIPANT_LIST = 'PARTICIPANT_LIST';
export const SUBTRACT_REMAINING_VACANCIES = 'SUBTRACT_REMAINING_VACANCIES';
export const UPCOMING_ACTIVITIES = 'UPCOMING_ACTIVITIES';
export const UPDATE_REMAINING_VACANCIES = 'UPDATE_REMAINING_VACANCIES';
export const UPDATED_REMAINING_VACANCIES = 'UPDATED_REMAINING_VACANCIES';
export const VIEW_MORE_CREATED_ACTIVITIES = 'VIEW_MORE_CREATED_ACTIVITIES';

const DEFAULT_MESSAGE = 'DEFAULT_MESSAGE';
export const BOT_DEFAULT_MESSAGE = `bot.${DEFAULT_MESSAGE}`;

export const DATETIME_QUESTION = 'DATETIME_QUESTION';
export const DATETIME = 'DATETIME';
export const INVALID_DATETIME = 'INVALID_DATETIME';
export const LOCATION_INSTRUCTION = 'LOCATION_INSTRUCTION';
export const LOCATION_QUESTION = 'LOCATION_QUESTION';
export const PRICE_QUESTION = 'PRICE_QUESTION';
export const REMAINING_VACANCIES_QUESTION = 'REMAINING_VACANCIES_QUESTION';
export const ACTIVITY_TYPE_QUESTION = 'ACTIVITY_TYPE_QUESTION';
export const STATE_ACTIVITY_TYPE_QUESTION = `state.${ACTIVITY_TYPE_QUESTION}`;
export const CREATE_ACTIVITY_CLOSING = 'CREATE_ACTIVITY_CLOSING';
export const STATE_CREATE_ACTIVITY_CLOSING = `state.${CREATE_ACTIVITY_CLOSING}`;
const DATETIME_CONFIRMATION = 'DATETIME_CONFIRMATION';
export const STATE_DATETIME_CONFIRMATION = `state.${DATETIME_CONFIRMATION}`;
const INVALID_ACTIVITY_TYPE = 'INVALID_ACTIVITY_TYPE';
export const STATE_INVALID_ACTIVITY_TYPE = `state.${INVALID_ACTIVITY_TYPE}`;
const INVALID_LOCATION = 'INVALID_LOCATION';
export const STATE_INVALID_LOCATION = `state.${INVALID_LOCATION}`;
const INVALID_PRICE = 'INVALID_PRICE';
export const STATE_INVALID_PRICE = `state.${INVALID_PRICE}`;
const INVALID_REMAINING_VACANCIES = 'INVALID_REMAINING_VACANCIES';
export const STATE_INVALID_REMAINING_VACANCIES = `state.${INVALID_REMAINING_VACANCIES}`;

export const REGISTRATION = 'REGISTRATION';
export const REGISTRATION_FAILURE = 'REGISTRATION_FAILURE';
const REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS';
export const USER_REGISTRATION_SUCCESS = `user.${REGISTRATION_SUCCESS}`;

export const PERSISTENT_MENU = [
  {
    locale: ENGLISH_LOCALE,
    call_to_actions: [
      {
        type: 'postback',
        title: activityI18nEn[UPCOMING_ACTIVITIES],
        payload: UPCOMING_ACTIVITIES_PAYLOAD,
      },
      {
        type: 'postback',
        title: activityI18nEn[JOINED_ACTIVITIES],
        payload: JOINED_ACTIVITIES_PAYLOAD,
      },
      {
        type: 'postback',
        title: activityI18nEn[CREATED_ACTIVITIES],
        payload: CREATED_ACTIVITIES_PAYLOAD,
      },
      {
        type: 'postback',
        title: activityI18nEn[INITIALIZE_ACTIVITY],
        payload: INITIALIZE_ACTIVITY_PAYLOAD,
      },
    ],
  },
  {
    locale: DEFAULT_LOCALE,
    call_to_actions: [
      {
        type: 'postback',
        title: activityI18nSr[UPCOMING_ACTIVITIES],
        payload: UPCOMING_ACTIVITIES_PAYLOAD,
      },
      {
        type: 'postback',
        title: activityI18nSr[JOINED_ACTIVITIES],
        payload: JOINED_ACTIVITIES_PAYLOAD,
      },
      {
        type: 'postback',
        title: activityI18nSr[CREATED_ACTIVITIES],
        payload: CREATED_ACTIVITIES_PAYLOAD,
      },
      {
        type: 'postback',
        title: activityI18nSr[INITIALIZE_ACTIVITY],
        payload: INITIALIZE_ACTIVITY_PAYLOAD,
      },
    ],
  },
];
