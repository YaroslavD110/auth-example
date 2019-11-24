import { SignUpDTO } from '../auth/tdo/signup.dto';
import { User } from './user.entity';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager } from 'typeorm';
import { hash, genSalt } from 'bcrypt';

@Injectable()
export class UserService {
  private logger = new Logger();
  private manager = getManager();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(signUpDTO: SignUpDTO) {
    const user = new User();

    user.email = signUpDTO.email;
    user.username = signUpDTO.username;

    try {
      user.salt = await genSalt(10);
      user.password = await hash(signUpDTO.password, user.salt);

      await this.manager.save(user);

      this.logger.verbose(`User "${user.username}" was created!`);

      return user;
    } catch (error) {
      this.logger.error('Filed to create new User!', error.trace);

      if (error.code == 23505) {
        throw new BadRequestException('Duplicated unique value!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
