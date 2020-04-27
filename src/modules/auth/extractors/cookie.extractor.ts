import { Request } from 'express';
import { JWT_COOKIE_NAME } from 'modules/auth/auth.constants';

export const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[JWT_COOKIE_NAME];
  }
  return token;
};
