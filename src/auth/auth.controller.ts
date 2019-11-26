import { Request } from 'express';
import { AuthService } from './auth.service';
import { SignInDTO } from './tdo/signin.dto';
import { UserService } from './../user/user.service';
import { Controller, Post, Body, Req } from '@nestjs/common';
import { SignUpDTO } from './tdo/signup.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signup')
  signUp(@Body() signUpDTO: SignUpDTO) {
    return this.userService.createUser(signUpDTO);
  }

  @Post('/signin')
  signIn(@Req() req: Request, @Body() signInDTO: SignInDTO) {
    return this.authService.signIn(req, signInDTO);
  }
}
