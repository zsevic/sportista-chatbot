import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.payload';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() payload: LoginUserDto): Promise<User> {
    const user = await this.authService.validateUser(payload);
    const token = this.authService.createToken(user);

    return {
      ...user,
      token,
    };
  }

  @Post('register')
  async register(@Body() payload: RegisterUserDto): Promise<User> {
    const user = await this.userService.register(payload);
    const token = this.authService.createToken(user);

    return {
      ...user,
      token,
    };
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin')
  @Get('me')
  async getLoggedInUser(@Request() request): Promise<User> {
    return request.user;
  }
}
