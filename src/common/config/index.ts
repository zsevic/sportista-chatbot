export default () => ({
  EXTENSIONS_URL: process.env.EXTENSIONS_URL,
  FB_APP_SECRET: process.env.FB_APP_SECRET,
  FB_PAGE_ACCESS_TOKEN: process.env.FB_PAGE_ACCESS_TOKEN,
  GRAPH_API_VERSION: process.env.GRAPH_API_VERSION || 'v8.0',
  PORT: process.env.PORT || 8080,
  WEBHOOK_VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN,
});
