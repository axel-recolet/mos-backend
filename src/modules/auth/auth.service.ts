import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto';
import { Exception } from '../../utils/exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || user.password !== pass) {
      return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<void> {
    const { email } = createUserDto;
    const emailFree = await this.usersService
      .findOneByEmail(email)
      .then((user) => !user);

    if (!emailFree) throw new EmailAlreadyUsed();

    this.usersService.create(createUserDto);
  }
}

export class EmailAlreadyUsed extends Exception {
  constructor() {
    super();
    this.message = `Email already used`;
  }
}
