export default () => ({
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  LOGIN_FAILED_REDIRECTION_URL:
    process.env.LOGIN_FAILED_REDIRECTION_URL ||
    'http://localhost:3000/#/login/failed',
  LOGIN_SUCCESS_REDIRECTION_URL:
    process.env.LOGIN_FAILED_REDIRECTION_URL ||
    'http://localhost:3000/#/login/success',
  PORT: process.env.PORT || 8080,
});
