export default () => ({
  EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET || 'secret',
  PORT: process.env.PORT || 8080,
});
