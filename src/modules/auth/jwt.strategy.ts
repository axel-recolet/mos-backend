import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDepot } from '../depots/depot.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: (() => {
        const jwt = configService.getOrThrow('jwt').secret;
        return jwt;
      })(),
    });
  }

  async validate(payload: any): Promise<IJwtUser> {
    const { id, email, depots } = payload;
    return { id, email, depots };
  }
}

export interface IJwtUser {
  id: string;
  email: string;
  depots: IDepot[];
}
