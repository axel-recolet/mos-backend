import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto';
import { EmailAlreadyUsed } from './exceptions';
import { DepotsService } from '../depots/depots.service';
import { IUser } from '../users/user.interface';
import { IJwtUser } from './jwt.strategy';
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
  ): Promise<Omit<IUser, 'password'> | undefined> {
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
    const { id, email, depots } = user;
    const payload = {
      id,
      email,
      depots,
    };
    return {
      access_token: this._jwtService.sign(payload),
    };
  }

  async signup(createUserDto: SignupDto): Promise<IUser> {
    try {
      const { email, password, creditCard, createDepot, depotsLinks } =
        createUserDto;

      const emailFree = await this._usersService
        .findByEmail(email)
        .then((user) => !user);

      if (!emailFree) throw new EmailAlreadyUsed();

      const user = await this._usersService.create({ email, password });

      const depot = await (async () => {
        if (!createDepot || !creditCard) return;

        return await this._depotsService.create(
          {
            ...createDepot,
            creator: user.id,
          },
          {
            id: user.id,
            email: user.email,
            depots: [],
          },
        );
      })();

      if (depot) {
        user.depots.push(depot);
      }

      return user;
      // TODO: Implements depotsLinks
    } catch (e) {
      throw e;
    }
  }
}
