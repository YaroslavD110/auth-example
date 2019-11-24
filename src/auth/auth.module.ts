import { Session } from './session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([Session])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
