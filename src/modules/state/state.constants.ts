import {
  ACTIVITY_TYPE_QUESTION_TEXT,
  CREATE_ACTIVITY_CLOSING_TEXT,
  DATETIME_QUESTION_TEXT,
  DATETIME_TEXT,
  LOCATION_QUESTION_TEXT,
  PRICE_QUESTION_TEXT,
  REMAINING_VACANCIES_QUESTION_TEXT,
} from 'modules/bots/messenger-bot/messenger-bot.texts';
import { getDatetimeQuestion } from './state.utils';

export const states = {
  type: 'type',
  datetime: 'datetime',
  location: 'location',
  price: 'price',
  remaining_vacancies: 'remaining_vacancies',
  closing: 'closing',
};

const datetimeQuestion = getDatetimeQuestion(
  DATETIME_QUESTION_TEXT,
  DATETIME_TEXT,
);

export const messages = {
  [states.type]: ACTIVITY_TYPE_QUESTION_TEXT,
  [states.datetime]: datetimeQuestion,
  [states.location]: LOCATION_QUESTION_TEXT,
  [states.price]: PRICE_QUESTION_TEXT,
  [states.remaining_vacancies]: REMAINING_VACANCIES_QUESTION_TEXT,
  [states.closing]: CREATE_ACTIVITY_CLOSING_TEXT,
};

export const nextStates = {
  [states.type]: states.datetime,
  [states.datetime]: states.location,
  [states.location]: states.price,
  [states.price]: states.remaining_vacancies,
  [states.remaining_vacancies]: states.closing,
};
