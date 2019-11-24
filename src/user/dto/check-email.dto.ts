import { IsEmail } from 'class-validator';

export class CheckEmailParams {
  @IsEmail()
  email: string;
}
