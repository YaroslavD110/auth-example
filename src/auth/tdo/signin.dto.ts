import { IsNotEmpty, IsEmail } from 'class-validator';

export class SignInDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
