import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfig } from 'common/config/auth';

export const jwtFactory = {
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfig],
    }),
  ],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('jwt.secret'),
      signOptions: { expiresIn: configService.get('jwt.expiresIn') },
    };
  },
};
