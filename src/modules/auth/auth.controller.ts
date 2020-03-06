import { Controller, Post, Body, Get, Request, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto, RegisterUserDto } from 'modules/user/dto';
import { UserService } from 'modules/user/user.service';
import { User } from 'modules/user/user.payload';
import { AuthService } from './auth.service';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/roles.decorator';
import { AppRoles } from './roles/roles.enum';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService,
              private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() payload: LoginUserDto): Promise<User> {
    const user = await this.authService.validateUser(payload);
    const access_token = this.authService.createToken(user);

    return {
      ...user,
      access_token,
    };
  }

  @Post('register')
  async register(@Body() payload: RegisterUserDto): Promise<User> {
    const user = await this.userService.register(payload);
    const access_token = this.authService.createToken(user);

    return {
      ...user,
      access_token,
    };
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(AppRoles.USER)
  @Get('me')
  async getLoggedInUser(@Request() request): Promise<User> {
    this.logger.log(request.user);
    return request.user;
  }
}
