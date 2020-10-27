import { createHmac, timingSafeEqual } from 'crypto';
import { parse } from 'querystring';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const {
      body,
      headers: { 'x-hub-signature': signature },
    } = context.switchToHttp().getRequest();
    const { sha1 } = parse(signature);
    if (!sha1) return false;

    const appSecret = this.configService.get('FB_APP_SECRET');

    const hmac = createHmac('sha1', appSecret);
    const digest = Buffer.from(
      `sha1=${hmac.update(body).digest('hex')}`,
      'utf-8',
    );
    const checksum = Buffer.from(signature, 'utf-8');

    if (digest.length !== checksum.length || !timingSafeEqual(digest, checksum))
      return false;

    return true;
  }
}
