import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto';
import { EmailAlreadyUsed } from './exceptions';
import { DepotsService } from '../depots/depots.service';
import { IUser } from '../users/user.interface';
import { IDepot } from '../depots';
export { EmailAlreadyUsed } from './exceptions';

export type SafeUser = {
  id: string;
  email: string;
  depots: IDepot[];
};

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
  ): Promise<SafeUser | undefined> {
    try {
      const user = await this._usersService.findByEmail(email);
      if (!user || user.password !== pass) {
        return undefined;
      }

      return (() => {
        const { id, email, depots } = user;
        return { id, email, depots };
      })();
    } catch (error) {
      throw error;
    }
  }

  async login(user: Omit<IUser, 'password'>): Promise<{
    access_token: string;
  }> {
    try {
      const { id, email, depots } = user;
      return {
        access_token: this._jwtService.sign({ id, email, depots }),
      };
    } catch (error) {
      throw error;
    }
  }

  async signup(createUserDto: SignupDto): Promise<SafeUser> {
    try {
      const { email } = createUserDto;

      const emailFree = await this._usersService
        .findByEmail(email)
        .then((user) => !user);

      if (!emailFree) throw new EmailAlreadyUsed();

      return await (async () => {
        const { id, email, depots } = await this._usersService.create(
          createUserDto,
        );

        return { id, email, depots };
      })();
    } catch (e) {
      throw e;
    }
  }
}
