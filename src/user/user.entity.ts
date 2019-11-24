import { PrimaryGeneratedColumn, Entity, Column, Unique } from 'typeorm';
import { IsEmail } from 'class-validator';

@Entity('user')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail()
  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  salt: string;

  @Column()
  password: string;
}
