import { ConfigService } from './../config/config.service';
import { AuthDTO } from './dto/auth.dto';
import { User } from './../user/user.entity';
import { Session } from './session.entity';
import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import * as uuid from 'uuid/v4';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly logger = new Logger();
  private readonly manager = getManager();

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async signIn(authDTO: AuthDTO) {
    const user = await this.userRepository.findOne({
      where: { email: authDTO.email },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const passwordValidation = await user.comparePassword(authDTO.password);
    if (!passwordValidation) {
      throw new BadRequestException();
    }

    return this.createSession(user, authDTO.fingerprint, authDTO.userAgent);
  }

  private async createSession(
    user: User,
    fingerprint: string,
    userAgent: string,
  ) {
    try {
      const newSessionUUID = uuid();
      const accessToken = jwt.sign(
        { id: user.id },
        this.configService.get('JWT_SECRET'),
      );
      const existingSessionsList = await this.sessionRepository.find({
        where: { userId: user.id },
      });

      const isSessionsOverflow =
        existingSessionsList.length >
        parseInt(this.configService.get('MAX_SESSIONS_NUMBER_PER_USER'));

      if (isSessionsOverflow) {
        for (let session of existingSessionsList) {
          await this.manager.remove(session);
        }
      }

      const existingSession = existingSessionsList.find(
        ses => ses.fingerprint === fingerprint && ses.userAgent === userAgent,
      );
      if (!existingSession || isSessionsOverflow) {
        const session = new Session();

        session.user = user;
        session.userAgent = userAgent;
        session.refreshToken = newSessionUUID;
        session.expiresIn = 1000 * 60 * 60 * 24 * 30;

        await this.manager.save(session);
      } else {
        existingSession.refreshToken = newSessionUUID;
        await this.manager.save(existingSession);
      }

      this.logger.verbose(
        `> New auth session for "${user.username}" was created!`,
      );
      return { accessToken, refreshToken: newSessionUUID };
    } catch (error) {
      this.logger.error('> Filed to create a session!', error.trace);
      throw new BadRequestException();
    }
  }
}
