import { Request } from 'express';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signin.dto';
import { UserService } from './../user/user.service';
import { Controller, Post, Body, Req } from '@nestjs/common';
import { SignUpDTO } from './dto/signup.dto';

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
    const userAgent = req.headers['user-agent'];

    return this.authService.signIn({ ...signInDTO, userAgent });
  }
}
