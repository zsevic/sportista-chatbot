import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'modules/user/dto';
import { User } from 'modules/user/user.payload';
import { UserService } from 'modules/user/user.service';
import { Tokens } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  createAccessToken(userId: string): string {
    const expiresIn = this.configService.get('jwt.accessTokenExpiresIn');
    return this.jwtService.sign({ id: userId }, { expiresIn });
  }

  createRefreshToken(userId: string): string {
    const expiresIn = this.configService.get('jwt.refreshTokenExpiresIn');
    return this.jwtService.sign({ id: userId }, { expiresIn });
  }

  createTokens(userId: string): Tokens {
    return {
      accessToken: this.createAccessToken(userId),
      refreshToken: this.createRefreshToken(userId),
    };
  }

  async validateUser(payload: LoginUserDto): Promise<User> {
    const user = await this.userService.getByEmailAndPassword(
      payload.email,
      payload.password,
    );
    if (!user) {
      throw new UnauthorizedException('Wrong login combination');
    }

    return user;
  }

  verifyToken(token: string): void {
    try {
      this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Token is not valid');
    }
  }
}
