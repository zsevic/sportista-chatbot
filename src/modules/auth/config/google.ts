import { registerAs } from '@nestjs/config';

export const googleConfig = registerAs('google', () => ({
  clientID: process.env.GOOGLE_CLIENT_ID || 'client id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'client secret',
  callbackURL:
    process.env.GOOGLE_CALLBACK_URL ||
    'http://localhost:8080/auth/google/callback',
}));
