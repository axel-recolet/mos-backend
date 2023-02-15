import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDepot } from '../depots/depot.interface';
import { IUser, UsersService } from 'users';
import { DepotsPermission } from '../depots/depots.permission';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _usersService: UsersService,
    private readonly _depotsPermis: DepotsPermission,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: (() => {
        const jwt = _configService.getOrThrow('jwt').secret;
        return jwt;
      })(),
    });
  }

  async validate(payload: JwtPayload): Promise<Omit<IUser, 'password'>> {
    if (!payload.id) throw new UnauthorizedException();

    const user = await this._usersService.findById(payload.id);
    if (!user) throw new UnauthorizedException();

    for (const [i, depot] of Object.entries(user.depots)) {
      const islinked = await this._depotsPermis
        .getDepot(user, depot)
        .catch((error) => false);
      if (!islinked) {
        delete user.depots[i];
      }
    }

    const { id, email, depots, creditCard } = user;
    return { id, email, depots, creditCard };
  }
}

export interface JwtPayload {
  id: string;
  email: string;
  depots: IDepot[];
}
