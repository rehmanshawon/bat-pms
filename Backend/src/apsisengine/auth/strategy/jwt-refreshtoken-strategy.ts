import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef, ContextIdFactory } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { jwtConstants } from '../constants';
import { JwtPayloadInterface } from '../interfaces';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refreshtoken-jwt',
) {
  constructor(private moduleRef: ModuleRef) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('access_token'),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: JwtPayloadInterface) {
    //get request context id
    const contextId = ContextIdFactory.getByRequest(req);
    //resolve module reference of auth service
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    const user = await authService.validateRefreshToken(
      req.body.refresh_token,
      payload,
    );

    if (!user) {
      throw new UnauthorizedException('Unauthorized Access!');
    }

    return payload;
  }
}
