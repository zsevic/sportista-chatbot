const redisUrlParse = require('redis-url-parse');
const { isEnv } = require('./dist/src/common/utils');
const {
  GET_STARTED_PAYLOAD,
  GREETING_TEXT,
  // PERSISTENT_MENU
} = require('./dist/src/modules/bots/messenger-bot/messenger-bot.constants');
const redisConfig = process.env.REDIS_URL && redisUrlParse(process.env.REDIS_URL);

module.exports = {
  session: {
    driver: isEnv('production') ? 'redis' : 'memory',
    stores: {
      memory: {
        maxSize: 500,
      },
      redis: redisConfig ? {
        db: redisConfig.database,
        host: redisConfig.host,
        password: redisConfig.password,
        port: redisConfig.port,
      } : {},
    },
  },
  initialState: {},
  channels: {
    messenger: {
      enabled: true,
      fields: ['messages', 'messaging_postbacks'],
      path: '/webhooks/messenger',
      pageId: process.env.MESSENGER_PAGE_ID,
      accessToken: process.env.MESSENGER_ACCESS_TOKEN,
      appId: process.env.MESSENGER_APP_ID,
      appSecret: process.env.MESSENGER_APP_SECRET,
      verifyToken: process.env.MESSENGER_VERIFY_TOKEN,
      profile: {
        getStarted: {
          payload: GET_STARTED_PAYLOAD,
        },
        greeting: GREETING_TEXT,
        // persistentMenu: PERSISTENT_MENU,
        whitelistedDomains: [process.env.EXTENSIONS_URL],
      },
    },
  },
};
