import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'secret',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '20s',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '300s',
}));
