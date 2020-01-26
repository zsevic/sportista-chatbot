import { ConfigModule, ConfigService } from '@nestjs/config';
import config from 'common/config';

export const jwtConfig = {
  imports: [ConfigModule.forRoot({
    load: [config],
  })],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('JWT_SECRET_KEY'),
      signOptions: { expiresIn: configService.get('JWT_EXPIRATION_TIME') },
    };
  },
};
