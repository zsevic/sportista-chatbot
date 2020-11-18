import { MessengerClient } from 'messaging-api-messenger';
import {
  GET_STARTED_PAYLOAD,
  GREETING_TEXT,
  PERSISTENT_MENU,
} from 'modules/bots/messenger-bot/messenger-bot.constants';

const client = new MessengerClient({
  accessToken: process.env.MESSENGER_ACCESS_TOKEN,
  appId: process.env.MESSENGER_APP_ID,
  appSecret: process.env.MESSENGER_APP_SECRET,
  version: '8.0',
});

client
  .setMessengerProfile({
    getStarted: {
      payload: GET_STARTED_PAYLOAD,
    },
    greeting: GREETING_TEXT,
    persistentMenu: PERSISTENT_MENU,
    whitelistedDomains: [process.env.MESSENGER_EXTENSIONS_URL],
  })
  .then(() => console.log('Messenger profile is set'))
  .catch(() => console.error('Messenger profile is not set'));
