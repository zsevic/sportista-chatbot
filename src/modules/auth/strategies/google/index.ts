import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { use } from 'passport';
import { Strategy } from 'passport-google-oauth2';
import { UserService } from 'modules/user/user.service';

@Injectable()
export class GoogleStrategy {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.init();
  }

  private init(): void {
    use(
      'google',
      new Strategy(
        {
          clientID: this.configService.get('google.clientID'),
          clientSecret: this.configService.get('google.clientSecret'),
          callbackURL: this.configService.get('google.callbackURL'),
        },
        async (
          accessToken: string,
          refreshToken: string,
          profile: any,
          done: any,
        ): Promise<void> => {
          const user = await this.userService.findOrCreate(profile);

          done(null, user);
        },
      ),
    );
  }
}
