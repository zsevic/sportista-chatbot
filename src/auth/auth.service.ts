import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.payload';
import { LoginUserDto } from 'src/user/dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
              private readonly jwtService: JwtService) {}

  createToken(userPayload: User): string {
    return this.jwtService.sign({ id: userPayload.id });
  }

  async validateUser(payload: LoginUserDto): Promise<User> {
    const user = await this.userService.getByEmailAndPassword(payload.email, payload.password);
    if (!user) {
      throw new UnauthorizedException('Wrong login combination');
    }

    return user;
  }
}
