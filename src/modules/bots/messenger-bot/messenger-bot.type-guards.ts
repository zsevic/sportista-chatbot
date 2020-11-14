import { MessengerTypes } from 'bottender';
import {
  ButtonTemplate,
  GenericTemplate,
  Message,
} from './messenger-bot.types';

export const isButtonTemplate = (
  message: Message | Message[],
): message is ButtonTemplate =>
  (message as ButtonTemplate).text !== undefined &&
  (message as ButtonTemplate).buttons !== undefined;

export const isGenericTemplate = (
  message: Message | Message[],
): message is GenericTemplate =>
  (message as GenericTemplate).cards !== undefined;

export const isQuickReplyTemplate = (
  message: Message | Message[],
): message is MessengerTypes.TextMessage =>
  (message as MessengerTypes.TextMessage).text !== undefined &&
  (message as MessengerTypes.TextMessage).quickReplies !== undefined &&
  (message as MessengerTypes.TextMessage).quickReplies.length > 0;
