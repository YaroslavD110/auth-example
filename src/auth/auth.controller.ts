import { UserService } from './../user/user.service';
import { Controller, Post, Body } from '@nestjs/common';
import { SignUpDTO } from './tdo/signup.dto';
import { hash, genSalt } from 'bcrypt';

@Controller()
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  signUp(@Body() signUpDTO: SignUpDTO) {
    return this.userService.createUser(signUpDTO);
  }
}
