import { MessengerTypes } from 'bottender';

export type ButtonTemplate = {
  text: string;
  buttons: Button<MessengerTypes.TemplateButton[]>;
};

export type Button<T> = T & {
  messengerExtensions?: boolean;
  webviewShareButton?: 'hide' | 'show';
};

type Coordinates = {
  lat: number;
  long: number;
};

export type GenericTemplate = {
  cards: MessengerTypes.TemplateElement[];
};

export type I18n = {
  [index: string]: string;
};

export type I18nOptions = {
  locale: string;
  gender?: string;
  timezone?: string;
};

export type Location = {
  coordinates: Coordinates;
  title: string;
  url: string;
};

export type Message =
  | string
  | MessengerTypes.TextMessage
  | ButtonTemplate
  | GenericTemplate;

export type ResponseServiceMessages = {
  [state: string]: string[];
};

export type ValidationResponse =
  | string
  | MessengerTypes.TextMessage
  | Button<ButtonTemplate>[];
