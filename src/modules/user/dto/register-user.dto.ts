import { IsNotEmpty, IsEmail, MinLength, IsEnum } from 'class-validator';
import { AppRoles } from 'modules/auth/roles/roles.enum';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEnum(AppRoles)
  readonly role: string;

  @IsNotEmpty()
  @MinLength(5)
  readonly password: string;
}
