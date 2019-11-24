import { CheckEmailParams } from './dto/check-email.dto';
import { UserService } from './user.service';
import { Controller, Get, Param } from '@nestjs/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/check-email/:email')
  checkEmailUnique(@Param() { email }: CheckEmailParams) {
    return this.userService.checkEmailUnique(email);
  }
}
