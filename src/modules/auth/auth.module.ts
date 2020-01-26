import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'modules/user/user.module';
import config from 'common/config';
import { AuthService } from './auth.service';
import { JwtStrategy, jwtConfig } from './strategies/jwt';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      load: [config],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule.register({ defaultStrategy: 'jwt' })],
})
export class AuthModule {}
