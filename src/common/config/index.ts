export default () => ({
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET || 'secret',
  LOGIN_FAILED_REDIRECTION_URL:
    process.env.LOGIN_FAILED_REDIRECTION_URL ||
    'http://localhost:3000/#/login/failed',
  PORT: process.env.PORT || 8080,
});
