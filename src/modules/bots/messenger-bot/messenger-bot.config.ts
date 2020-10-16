import activityI18nEn from 'i18n/en/activity.json';
import activityI18nSr from 'i18n/sr/activity.json';
import userI18nEn from 'i18n/en/user.json';
import userI18nSr from 'i18n/sr/user.json';
import {
  CREATED_ACTIVITIES,
  CREATED_ACTIVITIES_PAYLOAD,
  DEFAULT_LOCALE,
  EN_GB_LOCALE,
  EN_US_LOCALE,
  INITIALIZE_ACTIVITY,
  INITIALIZE_ACTIVITY_PAYLOAD,
  JOINED_ACTIVITIES,
  JOINED_ACTIVITIES_PAYLOAD,
  SR_RS_LOCALE,
  UPCOMING_ACTIVITIES,
  UPCOMING_ACTIVITIES_PAYLOAD,
  UPDATE_LOCALE,
  UPDATE_LOCALE_PAYLOAD,
  UPDATE_LOCATION,
} from './messenger-bot.constants';

export default () => {
  const EN_PERSISTENT_MENU = [
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
    {
      type: 'web_url',
      title: userI18nEn[UPDATE_LOCATION],
      url: `${process.env.EXTENSIONS_URL}/extensions/location`,
      messenger_extensions: true,
      webview_height_ratio: 'compact',
    },
    {
      type: 'postback',
      title: userI18nEn[UPDATE_LOCALE],
      payload: UPDATE_LOCALE_PAYLOAD,
    },
  ];

  const SR_PERSISTENT_MENU = [
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
    {
      type: 'web_url',
      title: userI18nSr[UPDATE_LOCATION],
      url: `${process.env.EXTENSIONS_URL}/extensions/location`,
      messenger_extensions: true,
      webview_height_ratio: 'compact',
    },
    {
      type: 'postback',
      title: userI18nSr[UPDATE_LOCALE],
      payload: UPDATE_LOCALE_PAYLOAD,
    },
  ];

  return {
    persistentMenu: [
      {
        locale: EN_GB_LOCALE,
        call_to_actions: EN_PERSISTENT_MENU,
      },
      {
        locale: EN_US_LOCALE,
        call_to_actions: EN_PERSISTENT_MENU,
      },
      {
        locale: SR_RS_LOCALE,
        call_to_actions: SR_PERSISTENT_MENU,
      },
      {
        locale: DEFAULT_LOCALE,
        call_to_actions: SR_PERSISTENT_MENU,
      },
    ],
  };
};