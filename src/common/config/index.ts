export default () => ({
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  EXTENSIONS_URL: process.env.EXTENSIONS_URL,
  MESSENGER_APP_ID: process.env.MESSENGER_APP_ID,
  MESSENGER_APP_SECRET: process.env.MESSENGER_APP_SECRET,
  MESSENGER_PAGE_ID: process.env.MESSENGER_PAGE_ID,
  PORT: process.env.PORT || 8080,
  SENTRY_DSN: process.env.SENTRY_DSN,
});
