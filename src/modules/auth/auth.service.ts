import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto';
import { Document } from '../../utils/document.type';
import { User } from '../users/user.entity';
import { EmailAlreadyUsed } from './exceptions';
import { DepotsService } from '../depots/depots.service';
import { IUser } from '../users/user.interface';
export { EmailAlreadyUsed } from './exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly _usersService: UsersService,
    private readonly _jwtService: JwtService,
    private readonly _depotsService: DepotsService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | undefined | null> {
    const user = await this._usersService.findByEmail(email);
    if (!user || user.password !== pass) {
      return undefined;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async login(user: Omit<IUser, 'password'>): Promise<{
    access_token: string;
  }> {
    const payload = {
      username: user.email,
      sub: user.id,
      depots: user.depots,
    };
    return {
      access_token: this._jwtService.sign(payload),
    };
  }

  async signup(createUserDto: SignupDto): Promise<void> {
    try {
      const { email, password, createDepot, depotsLinks } =
        createUserDto;
      const emailFree = await this._usersService
        .findByEmail(email)
        .then((user) => !user);

      if (!emailFree) throw new EmailAlreadyUsed();

      const user = await this._usersService.create({ email, password });

      await (async () => {
        if (!createDepot) return;

        return await this._depotsService.create({
          ...createDepot,
          creator: user.id,
        });
      })();

      // TODO: Implements depotsLinks
    } catch (e) {
      throw e;
    }
  }
}
