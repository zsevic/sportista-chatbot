import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { EventsGateway } from 'common/events/events.gateway';
import { AuthService } from 'modules/auth/auth.service';
import { User } from 'modules/user/user.payload';

@Injectable()
export class StrategyCallbackMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService, private readonly eventsGateway: EventsGateway) {}

  async use(req: any, res: Response): Promise<void> {
    const access_token = this.authService.createToken(req.user as User);

    this.eventsGateway.server.emit('logged_in', {
      ...req.user,
      access_token,
    });

    res.end();
  }
}
