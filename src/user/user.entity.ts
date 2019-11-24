import { PrimaryGeneratedColumn, Entity, Column, Unique } from 'typeorm';
import { IsEmail } from 'class-validator';
import { hash } from 'bcrypt';

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

  public async comparePassword(password: string) {
    const hashedPassword = await hash(password, this.salt);
    return hashedPassword === this.password;
  }
}
