import { User } from './../user/user.entity';
import { SignInDTO } from './tdo/signin.dto';
import { Session } from './session.entity';
import {
  Injectable,
  Logger,
  BadRequestException,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import * as uuid from 'uuid/v4';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

const MAX_SESSIONS_NUMBER_PER_USER = 5;

@Injectable()
export class AuthService {
  private readonly logger = new Logger();
  private readonly manager = getManager();

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async signIn(req: Request, signInDTO: SignInDTO) {
    const user = await this.userRepository.findOne({
      where: { email: signInDTO.email },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const passwordValidation = await user.comparePassword(signInDTO.password);
    if (!passwordValidation) {
      throw new BadRequestException();
    }

    return this.createSession(user, req.ip, req.headers['user-agent']);
  }

  private async createSession(user: User, ip: string, userAgent: string) {
    try {
      const newSessionUUID = uuid();
      const accessToken = jwt.sign({ id: user.id }, 'superrrsecreeet');
      const existingSessionsList = await this.sessionRepository.find({
        where: { userId: user.id },
      });

      const isSessionsOverflow =
        existingSessionsList.length > MAX_SESSIONS_NUMBER_PER_USER;
      if (isSessionsOverflow) {
        for (let session of existingSessionsList) {
          await this.manager.remove(session);
        }
      }

      const existingSession = existingSessionsList.find(
        ses => ses.clientIp === ip && ses.userAgent === userAgent,
      );
      if (!existingSession || isSessionsOverflow) {
        const session = new Session();

        session.user = user;
        session.clientIp = ip;
        session.userAgent = userAgent;
        session.refreshToken = newSessionUUID;
        session.expiresIn = 1000 * 60 * 60 * 24 * 30;

        await this.manager.save(session);
      } else {
        existingSession.refreshToken = newSessionUUID;
        await this.manager.save(existingSession);
      }

      this.logger.verbose(
        `New auth session for "${user.username}" was created!`,
      );
      return { accessToken, refreshToken: newSessionUUID };
    } catch (error) {
      console.error(error);
      throw new BadRequestException();
    }
  }
}
