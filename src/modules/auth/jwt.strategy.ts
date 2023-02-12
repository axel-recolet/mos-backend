import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDepot } from '../depots/depot.interface';
import { IUser, UsersService } from 'users';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly _usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: (() => {
        const jwt = configService.getOrThrow('jwt').secret;
        return jwt;
      })(),
    });
  }

  async validate(payload: JwtPayload): Promise<Omit<IUser, 'password'>> {
    if (!payload.id) throw new UnauthorizedException();

    const user = await this._usersService.findById(payload.id);
    if (!user) throw new UnauthorizedException();

    const { id, email, depots, creditCard } = user;
    return { id, email, depots, creditCard };
  }
}

export interface JwtPayload {
  id: string;
  email: string;
  depots: IDepot[];
}
