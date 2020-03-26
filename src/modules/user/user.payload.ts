import { Exclude } from 'class-transformer';

export class User {
  id?: string;

  facebook_id?: string;

  google_id?: string;

  name: string;

  email: string;

  role: string;

  @Exclude()
  password?: string;

  access_token?: string;
}
