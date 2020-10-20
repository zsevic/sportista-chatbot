import activityI18nEn from 'i18n/en/activity.json';
import activityI18nSr from 'i18n/sr/activity.json';
import botI18nEn from 'i18n/en/bot.json';
import botI18nSr from 'i18n/sr/bot.json';
import userI18nEn from 'i18n/en/user.json';
import userI18nSr from 'i18n/sr/user.json';
import {
  ABOUT_ME,
  ABOUT_ME_PAYLOAD,
  CREATED_ACTIVITIES,
  CREATED_ACTIVITIES_PAYLOAD,
  DEFAULT,
  EN_GB_LOCALE,
  EN_US_LOCALE,
  FEEDBACK_BUTTON,
  INITIALIZE_ACTIVITY,
  INITIALIZE_ACTIVITY_PAYLOAD,
  INITIALIZE_FEEDBACK_PAYLOAD,
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
  const EN_GB_PERSISTENT_MENU = [
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
      url: `${process.env.EXTENSIONS_URL}/extensions/location?lang=${EN_GB_LOCALE}`,
      messenger_extensions: true,
      webview_height_ratio: 'compact',
    },
    {
      type: 'postback',
      title: userI18nEn[UPDATE_LOCALE],
      payload: UPDATE_LOCALE_PAYLOAD,
    },
    {
      type: 'postback',
      title: botI18nEn[FEEDBACK_BUTTON],
      payload: INITIALIZE_FEEDBACK_PAYLOAD,
    },
    {
      type: 'postback',
      title: botI18nEn[ABOUT_ME],
      payload: ABOUT_ME_PAYLOAD,
    },
  ];

  const EN_US_PERSISTENT_MENU = [
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
      url: `${process.env.EXTENSIONS_URL}/extensions/location?lang=${EN_US_LOCALE}`,
      messenger_extensions: true,
      webview_height_ratio: 'compact',
    },
    {
      type: 'postback',
      title: userI18nEn[UPDATE_LOCALE],
      payload: UPDATE_LOCALE_PAYLOAD,
    },
    {
      type: 'postback',
      title: botI18nEn[FEEDBACK_BUTTON],
      payload: INITIALIZE_FEEDBACK_PAYLOAD,
    },
    {
      type: 'postback',
      title: botI18nEn[ABOUT_ME],
      payload: ABOUT_ME_PAYLOAD,
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
      url: `${process.env.EXTENSIONS_URL}/extensions/location?lang=${SR_RS_LOCALE}`,
      messenger_extensions: true,
      webview_height_ratio: 'compact',
    },
    {
      type: 'postback',
      title: userI18nSr[UPDATE_LOCALE],
      payload: UPDATE_LOCALE_PAYLOAD,
    },
    {
      type: 'postback',
      title: botI18nSr[FEEDBACK_BUTTON],
      payload: INITIALIZE_FEEDBACK_PAYLOAD,
    },
    {
      type: 'postback',
      title: botI18nSr[ABOUT_ME],
      payload: ABOUT_ME_PAYLOAD,
    },
  ];

  return {
    persistentMenu: [
      {
        locale: EN_GB_LOCALE,
        call_to_actions: EN_GB_PERSISTENT_MENU,
      },
      {
        locale: EN_US_LOCALE,
        call_to_actions: EN_US_PERSISTENT_MENU,
      },
      {
        locale: SR_RS_LOCALE,
        call_to_actions: SR_PERSISTENT_MENU,
      },
      {
        locale: DEFAULT,
        call_to_actions: SR_PERSISTENT_MENU,
      },
    ],
  };
};
