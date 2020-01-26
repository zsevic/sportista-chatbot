export default () => ({
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'secret',
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME || '3600s',
});
