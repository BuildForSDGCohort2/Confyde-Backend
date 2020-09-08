import { Admin } from '../../shared/database';
import { Encrypter } from '../../shared/encrypter';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { readFileSync } from 'fs';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
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

  async validate(payload: any) {
    const userId: number = this.encrypter.decryptString(payload.sub);
    const data: any = this.encrypter.decrypt(payload.data, true);

    const user: Admin = await this.authService.validateAdmin(userId, data);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
