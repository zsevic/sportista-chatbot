import { PROJECT_NAME } from 'common/config/constants';
import {
  CREATED_ACTIVITIES_TEXT,
  CREATED_ACTIVITIES_TEXT_EN,
  CREATE_ACTIVITY_TEXT,
  CREATE_ACTIVITY_TEXT_EN,
  DEFAULT_MESSAGE_TEXT,
  UPCOMING_ACTIVITIES_TEXT,
  UPCOMING_ACTIVITIES_TEXT_EN,
} from './messenger-bot.texts';

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
const SERBIAN_LOCALE = 'sr_RS';
export const GREETING_TEXT = [
  {
    locale: DEFAULT_LOCALE,
    text: `Hi! With ${PROJECT_NAME} you can find missing players or join some game`,
  },
  {
    locale: SERBIAN_LOCALE,
    text: `Zdravo! ${PROJECT_NAME} ti pomaže da lakše nađeš igrače ili da se pridružiš timu u zakazanom terminu!`,
  },
];

export const PERSISTENT_MENU = [
  {
    locale: DEFAULT_LOCALE,
    call_to_actions: [
      {
        type: 'postback',
        title: UPCOMING_ACTIVITIES_TEXT_EN,
        payload: UPCOMING_ACTIVITIES_PAYLOAD,
      },
      {
        type: 'postback',
        title: CREATED_ACTIVITIES_TEXT_EN,
        payload: CREATED_ACTIVITIES_PAYLOAD,
      },
      {
        type: 'postback',
        title: CREATE_ACTIVITY_TEXT_EN,
        payload: INITIALIZE_ACTIVITY_PAYLOAD,
      },
    ],
  },
  {
    locale: SERBIAN_LOCALE,
    call_to_actions: [
      {
        type: 'postback',
        title: UPCOMING_ACTIVITIES_TEXT,
        payload: UPCOMING_ACTIVITIES_PAYLOAD,
      },
      {
        type: 'postback',
        title: CREATED_ACTIVITIES_TEXT,
        payload: CREATED_ACTIVITIES_PAYLOAD,
      },
      {
        type: 'postback',
        title: CREATE_ACTIVITY_TEXT,
        payload: INITIALIZE_ACTIVITY_PAYLOAD,
      },
    ],
  },
];

export const DEFAULT_ANSWER = {
  text: DEFAULT_MESSAGE_TEXT,
  quickReplies: [
    {
      title: UPCOMING_ACTIVITIES_TEXT,
      payload: UPCOMING_ACTIVITIES_PAYLOAD,
    },
    {
      title: CREATED_ACTIVITIES_TEXT,
      payload: CREATED_ACTIVITIES_PAYLOAD,
    },
    {
      title: CREATE_ACTIVITY_TEXT,
      payload: INITIALIZE_ACTIVITY_PAYLOAD,
    },
  ],
};

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
