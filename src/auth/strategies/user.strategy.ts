import { User } from '../../shared/database';
import { Encrypter } from '../../shared/encrypter';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { readFileSync } from 'fs';
import { AuthService } from '../auth.service';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
  constructor(private authService: AuthService, private encrypter: Encrypter) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: readFileSync(
        `${process.cwd()}/.keys/jwt-public.key`,
      ).toString(),
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async validate(payload: any) {
    const userId: number = this.encrypter.decryptString(payload.sub);
    const data: any = this.encrypter.decrypt(payload.data, true);

    const user: User = await this.authService.validateUser(userId, data, 'user');

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
