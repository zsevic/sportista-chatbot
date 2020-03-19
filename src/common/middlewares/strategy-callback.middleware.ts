import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { EventsGateway } from 'common/events/events.gateway';
import { AuthService } from 'modules/auth/auth.service';

@Injectable()
export class StrategyCallbackMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService, private readonly eventsGateway: EventsGateway) {}

  async use(req: any, res: Response): Promise<void> {
    const user = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
    };
    const access_token = this.authService.createToken(user);

    this.eventsGateway.server.emit('logged_in', {
      ...user,
      access_token,
    });

    res.end();
  }
}
