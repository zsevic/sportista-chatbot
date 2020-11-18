import { MessengerContext } from 'bottender';
import { BotUserOptions } from 'modules/bot-user/user.types';

export const getImageUrl = (activityType: string): string =>
  `https://loremflickr.com/460/240/${activityType}`;

export const getLocationUrl = (latitude: number, longitude: number): string =>
  `http://www.google.com/maps/place/${latitude},${longitude}`;

export const getUserOptions = (context: MessengerContext): BotUserOptions => {
  const {
    platform,
    _session: {
      user: { id: userId },
    },
  } = context;
  return {
    [`${platform}_id`]: userId,
  };
};
