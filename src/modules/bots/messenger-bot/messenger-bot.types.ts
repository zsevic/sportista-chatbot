import { MessengerTypes } from 'bottender';

export type ButtonTemplate = {
  text: string;
  buttons: Button<MessengerTypes.TemplateButton[]>;
};

export type Button<T> = T & {
  messengerExtensions?: boolean;
  webviewShareButton?: 'hide' | 'show';
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
