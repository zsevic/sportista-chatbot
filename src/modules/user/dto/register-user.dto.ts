import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @MinLength(5)
  readonly password: string;
}
