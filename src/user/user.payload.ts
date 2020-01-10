import { Exclude } from 'class-transformer';

export class User {
  id?: string;
  username: string;
  email: string;
  role: string;
  @Exclude()
  password?: string;
  token?: string;
}
