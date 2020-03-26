import { registerAs } from '@nestjs/config';

export const facebookConfig = registerAs('facebook', () => ({
  clientID: process.env.FACEBOOK_CLIENT_ID || 'client id',
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'client secret',
  fbGraphVersion: 'v3.0',
  callbackURL:
    process.env.FACEBOOK_CALLBACK_URL ||
    'http://localhost:8080/auth/facebook/callback',
}));
