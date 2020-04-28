import { CookieOptions } from 'express';

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  // secure: true,
  sameSite: 'lax',
};

export const JWT_COOKIE_NAME = 'jwt';
