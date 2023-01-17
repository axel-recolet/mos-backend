import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto';
import { Document } from '../../utils/document.type';
import { User } from '../users/user.schema';
import { Email } from '../../utils/email.type';
import { EmailAlreadyUsed } from './exceptions';
export { EmailAlreadyUsed } from './exceptions';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Document<Omit<User, 'password'>> | undefined | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || user.password !== pass) {
      return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async login(user: { email: Email; _id: string }): Promise<{
    access_token: string;
  }> {
    const payload = { username: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: SignupDto): Promise<void> {
    const { email } = createUserDto;
    const emailFree = await this.usersService
      .findOneByEmail(email)
      .then((user) => !user);

    if (!emailFree) throw new EmailAlreadyUsed();

    this.usersService.create(createUserDto);
  }
}
