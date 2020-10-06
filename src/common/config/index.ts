export default () => ({
  FB_APP_SECRET: process.env.FB_APP_SECRET,
  FB_PAGE_ACCESS_TOKEN: process.env.FB_PAGE_ACCESS_TOKEN,
  WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN,
  EXTENSIONS_URL: process.env.EXTENSIONS_URL,
  PORT: process.env.PORT || 8080,
});
