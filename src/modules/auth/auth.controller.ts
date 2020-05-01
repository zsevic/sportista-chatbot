import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginUserDto, RegisterUserDto } from 'modules/user/dto';
import { UserService } from 'modules/user/user.service';
import { User } from 'modules/user/user.payload';
import { COOKIE_OPTIONS, JWT_COOKIE_NAME } from './auth.constants';
import { AuthService } from './auth.service';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/roles.decorator';
import { AppRoles } from './roles/roles.enum';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() payload: LoginUserDto, @Res() res): Promise<User> {
    const user = await this.authService.validateUser(payload);
    const accessToken = this.authService.createToken(user);

    return res.cookie(JWT_COOKIE_NAME, accessToken, COOKIE_OPTIONS).json(user);
  }

  @Post('register')
  async register(@Body() payload: RegisterUserDto, @Res() res): Promise<User> {
    const user = await this.userService.register(payload);
    const accessToken = this.authService.createToken(user);

    return res.cookie(JWT_COOKIE_NAME, accessToken, COOKIE_OPTIONS).json(user);
  }

  @Post('logout')
  async logout(@Res() res: Response): Promise<void> {
    return res.clearCookie(JWT_COOKIE_NAME, COOKIE_OPTIONS).end();
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(AppRoles.USER)
  @Get('me')
  async getLoggedInUser(@Request() request): Promise<User> {
    this.logger.log(request.user);
    return request.user;
  }
}
