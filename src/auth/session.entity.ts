import { User } from './../user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('session')
@Unique(['refreshToken'])
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User)
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @Column('uuid')
  refreshToken: string;

  @Column()
  fingerprint: string;

  @Column()
  userAgent: string;

  @Column('bigint')
  expiresIn: number;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
