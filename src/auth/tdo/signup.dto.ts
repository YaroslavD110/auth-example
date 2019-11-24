import { IsNotEmpty, IsEmail } from 'class-validator';

export class SignUpDTO {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
