import { User } from './../user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('session')
@Unique(['refreshToken', 'fingerprint'])
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @Column('uuid')
  refreshToken: string;

  @Column()
  clientIp: string;

  @Column()
  userAgent: string;

  @Column()
  fingerprint: string;

  @Column('bigint')
  expiresIn: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
