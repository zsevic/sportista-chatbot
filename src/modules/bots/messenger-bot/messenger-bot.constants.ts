import { PROJECT_NAME } from 'common/config/constants';

export const ABOUT_ME_PAYLOAD = 'ABOUT_ME_PAYLOAD';
export const CREATED_ACTIVITIES_PAYLOAD = 'CREATED_ACTIVITIES_PAYLOAD';
export const GET_STARTED_PAYLOAD = 'BOOTBOT_GET_STARTED';
export const INITIALIZE_ACTIVITY_PAYLOAD = 'INITIALIZE_ACTIVITY_PAYLOAD';
export const INITIALIZE_FEEDBACK_PAYLOAD = 'INITIALIZE_FEEDBACK_PAYLOAD';
export const JOINED_ACTIVITIES_PAYLOAD = 'JOINED_ACTIVITIES_PAYLOAD';
export const NOTIFICATION_SUBSCRIPTION_PAYLOAD =
  'NOTIFICATION_SUBSCRIPTION_PAYLOAD';
export const UPCOMING_ACTIVITIES_PAYLOAD = 'UPCOMING_ACTIVITIES_PAYLOAD';

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
export const USER_LOCATION_TYPE = 'USER_LOCATION_TYPE';

export const SUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD =
  'SUBSCRIBE_TO_NOTIFICATION_PAYLOAD';
export const UNSUBSCRIBE_TO_NOTIFICATIONS_PAYLOAD =
  'UNSUBSCRIBE_TO_NOTIFICATION_PAYLOAD';

export const DEFAULT = 'default';
export const EN_GB_LOCALE = 'en_GB';
export const EN_US_LOCALE = 'en_US';
export const SR_RS_LOCALE = 'sr_RS';
const EN_GREETING_TEXT = `Hi! With ${PROJECT_NAME} you can find missing playmates or join some game. Use Messenger app for the best experience with ${PROJECT_NAME}`;
const SR_GREETING_TEXT = `Zdravo! ${PROJECT_NAME} ti pomaže da lakše nađeš igrače ili da se pridružiš timu u zakazanom terminu! Koristi Messenger aplikaciju za najbolje iskustvo sa ${PROJECT_NAME}`;
export const GREETING_TEXT = [
  {
    locale: EN_GB_LOCALE,
    text: EN_GREETING_TEXT,
  },
  {
    locale: EN_US_LOCALE,
    text: EN_GREETING_TEXT,
  },
  {
    locale: SR_RS_LOCALE,
    text: SR_GREETING_TEXT,
  },
  {
    locale: DEFAULT,
    text: SR_GREETING_TEXT,
  },
];

export const SKIPPED_POSTBACK_PAYLOADS = [
  GET_STARTED_PAYLOAD,
  INITIALIZE_ACTIVITY_PAYLOAD,
  INITIALIZE_FEEDBACK_PAYLOAD,
  NOTIFICATION_SUBSCRIPTION_PAYLOAD,
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
const CANCEL_ACTIVITY_SUCCESS = 'CANCEL_ACTIVITY_SUCCESS';
export const ACTIVITY_CANCEL_ACTIVITY_SUCCESS = `activity.${CANCEL_ACTIVITY_SUCCESS}`;
const JOIN_ACTIVITY_FAILURE = 'JOIN_ACTIVITY_FAILURE';
export const ACTIVITY_JOIN_ACTIVITY_FAILURE = `activity.${JOIN_ACTIVITY_FAILURE}`;
export const ACTIVITY_OPTIONS = 'ACTIVITY_OPTIONS';
const NO_PARTICIPANTS = 'NO_PARTICIPANTS';
export const ACTIVITY_NO_PARTICIPANTS = `activity.${NO_PARTICIPANTS}`;
export const NO_REMAINING_VACANCIES = 'NO_REMAINING_VACANCIES';
export const ACTIVITY_NO_REMAINING_VACANCIES = `activity.${NO_REMAINING_VACANCIES}`;
export const REMAINING_VACANCIES = 'REMAINING_VACANCIES';
export const ACTIVITY_REMAINING_VACANCIES = `activity.${REMAINING_VACANCIES}`;
const RESET_REMAINING_VACANCIES = 'RESET_REMAINING_VACANCIES';
export const ACTIVITY_RESET_REMAINING_VACANCIES = `activity.${RESET_REMAINING_VACANCIES}`;
const VIEW_MORE = 'VIEW_MORE';
export const ACTIVITY_VIEW_MORE = `activity.${VIEW_MORE}`;
const UPDATED_REMAINING_VACANCIES = 'UPDATED_REMAINING_VACANCIES';
export const ACTIVITY_UPDATED_REMAINING_VACANCIES = `activity.${UPDATED_REMAINING_VACANCIES}`;
export const UPDATE_REMAINING_VACANCIES_FAILURE =
  'UPDATE_REMAINING_VACANCIES_FAILURE';
export const ACTIVITY_UPDATE_REMAINING_VACANCIES_FAILURE = `activity.${UPDATE_REMAINING_VACANCIES_FAILURE}`;
export const ADD_REMAINING_VACANCIES = 'ADD_REMAINING_VACANCIES';
export const CANCEL_ACTIVITY = 'CANCEL_ACTIVITY';
export const CANCEL_PARTICIPATION = 'CANCEL_PARTICIPATION';
export const CANCEL_PARTICIPATION_SUCCESS = 'CANCEL_PARTICIPATION_SUCCESS';
export const CREATED_ACTIVITIES = 'CREATED_ACTIVITIES';
export const INITIALIZE_ACTIVITY = 'INITIALIZE_ACTIVITY';
export const JOIN_ACTIVITY = 'JOIN_ACTIVITY';
export const JOIN_ACTIVITY_SUCCESS = 'JOIN_ACTIVITY_SUCCESS';
export const JOINED_ACTIVITIES = 'JOINED_ACTIVITIES';
export const LOCATION = 'LOCATION';
export const NO_CREATED_ACTIVITIES = 'NO_CREATED_ACTIVITIES';
export const NO_JOINED_ACTIVITIES = 'NO_JOINED_ACTIVITIES';
export const NO_REMAINING_VACANCIES_BUTTON = 'NO_REMAINING_VACANCIES_BUTTON';
export const NO_UPCOMING_ACTIVITIES = 'NO_UPCOMING_ACTIVITIES';
export const NOTIFY_ORGANIZER = 'NOTIFY_ORGANIZER';
const NOTIFY_PARTICIPANTS = 'NOTIFY_PARTICIPANTS';
export const ACTIVITY_NOTIFY_PARTICIPANTS = `activity.${NOTIFY_PARTICIPANTS}`;
export const OPTIONS = 'OPTIONS';
export const ORGANIZER = 'ORGANIZER';
export const PARTICIPANT_LIST = 'PARTICIPANT_LIST';
export const SUBTRACT_REMAINING_VACANCIES = 'SUBTRACT_REMAINING_VACANCIES';
export const UPCOMING_ACTIVITIES = 'UPCOMING_ACTIVITIES';
export const UPDATE_REMAINING_VACANCIES = 'UPDATE_REMAINING_VACANCIES';
export const VIEW_MORE_CREATED_ACTIVITIES = 'VIEW_MORE_CREATED_ACTIVITIES';
export const VIEW_MORE_JOINED_ACTIVITIES = 'VIEW_MORE_JOINED_ACTIVITIES';
export const VIEW_MORE_UPCOMING_ACTIVITIES = 'VIEW_MORE_UPCOMING_ACTIVITIES';

export const ABOUT_ME = 'ABOUT_ME';
export const ABOUT_ME_1 = 'ABOUT_ME_1';
export const ABOUT_ME_2 = 'ABOUT_ME_2';
const CREATE_FEEDBACK = 'CREATE_FEEDBACK';
export const BOT_CREATE_FEEDBACK = `bot.${CREATE_FEEDBACK}`;
const DEFAULT_MESSAGE = 'DEFAULT_MESSAGE';
export const BOT_DEFAULT_MESSAGE = `bot.${DEFAULT_MESSAGE}`;
export const FEEDBACK_BUTTON = 'FEEDBACK_BUTTON';
const INITIALIZE_FEEDBACK = 'INITIALIZE_FEEDBACK';
export const BOT_INITIALIZE_FEEDBACK = `bot.${INITIALIZE_FEEDBACK}`;
export const NOTIFICATION_SUBSCRIPTION_BUTTON =
  'NOTIFICATION_SUBSCRIPTION_BUTTON';
const NOTIFICATION_SUBSCRIPTION_FAILURE = 'NOTIFICATION_SUBSCRIPTION_FAILURE';
export const BOT_NOTIFICATION_SUBSCRIPTION_FAILURE = `bot.${NOTIFICATION_SUBSCRIPTION_FAILURE}`;
const CANCEL_ACTIVITY_NOTIFICATION = 'CANCEL_ACTIVITY_NOTIFICATION';
export const BOT_CANCEL_ACTIVITY_NOTIFICATION = `bot.${CANCEL_ACTIVITY_NOTIFICATION}`;
const CANCEL_PARTICIPATION_NOTIFICATION = 'CANCEL_PARTICIPATION_NOTIFICATION';
export const BOT_CANCEL_PARTICIPATION_NOTIFICATION = `bot.${CANCEL_PARTICIPATION_NOTIFICATION}`;
const JOIN_ACTIVITY_NOTIFICATION = 'JOIN_ACTIVITY_NOTIFICATION';
export const BOT_JOIN_ACTIVITY_NOTIFICATION = `bot.${JOIN_ACTIVITY_NOTIFICATION}`;

export const DATETIME_QUESTION = 'DATETIME_QUESTION';
export const DATETIME_BUTTON = 'DATETIME_BUTTON';
export const STATE_DATETIME_BUTTON = `state.${DATETIME_BUTTON}`;
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

export const INVALID_USER_LOCATION = 'INVALID_USER_LOCATION';
export const REGISTRATION = 'REGISTRATION';
export const REGISTRATION_FAILURE = 'REGISTRATION_FAILURE';
const REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS';
export const SUBSCRIBE_TO_NOTIFICATIONS_BUTTON =
  'SUBSCRIBE_TO_NOTIFICATIONS_BUTTON';
export const SUBSCRIBE_TO_NOTIFICATIONS_TEXT =
  'SUBSCRIBE_TO_NOTIFICATIONS_TEXT';
export const UNSUBSCRIBE_TO_NOTIFICATIONS_BUTTON =
  'UNSUBSCRIBE_TO_NOTIFICATIONS_BUTTON';
export const UNSUBSCRIBE_TO_NOTIFICATIONS_TEXT =
  'UNSUBSCRIBE_TO_NOTIFICATIONS_TEXT';
export const UPDATE_LOCATION = 'UPDATE_LOCATION';
const UPDATE_LOCATION_SUCCESS = 'UPDATE_LOCATION_SUCCESS';
export const USER_UPDATE_LOCATION_SUCCESS = `user.${UPDATE_LOCATION_SUCCESS}`;
export const USER_LOCATION_BUTTON = 'USER_LOCATION_BUTTON';
export const USER_LOCATION_DESCRIPTION_TEXT = 'USER_LOCATION_DESCRIPTION_TEXT';
export const USER_LOCATION_FAILURE = 'USER_LOCATION_FAILURE';
export const USER_LOCATION_PAGE_TEXT = 'USER_LOCATION_PAGE_TEXT';
export const USER_LOCATION_SETTINGS_FAILURE = 'USER_LOCATION_SETTINGS_FAILURE';
export const USER_LOCATION_TEXT = 'USER_LOCATION_TEXT';
export const USER_REGISTRATION_SUCCESS = `user.${REGISTRATION_SUCCESS}`;
const SUBSCRIBE_TO_NOTIFICATIONS_FAILURE = 'SUBSCRIBE_TO_NOTIFICATIONS_FAILURE';
export const USER_SUBSCRIBE_TO_NOTIFICATIONS_FAILURE = `user.${SUBSCRIBE_TO_NOTIFICATIONS_FAILURE}`;
const SUBSCRIBE_TO_NOTIFICATIONS_SUCCESS = 'SUBSCRIBE_TO_NOTIFICATIONS_SUCCESS';
export const USER_SUBSCRIBE_TO_NOTIFICATIONS_SUCCESS = `user.${SUBSCRIBE_TO_NOTIFICATIONS_SUCCESS}`;
const UNSUBSCRIBE_TO_NOTIFICATIONS_FAILURE =
  'UNSUBSCRIBE_TO_NOTIFICATIONS_FAILURE';
export const USER_UNSUBSCRIBE_TO_NOTIFICATIONS_FAILURE = `user.${UNSUBSCRIBE_TO_NOTIFICATIONS_FAILURE}`;
const UNSUBSCRIBE_TO_NOTIFICATIONS_SUCCESS =
  'UNSUBSCRIBE_TO_NOTIFICATIONS_SUCCESS';
export const USER_UNSUBSCRIBE_TO_NOTIFICATIONS_SUCCESS = `user.${UNSUBSCRIBE_TO_NOTIFICATIONS_SUCCESS}`;
