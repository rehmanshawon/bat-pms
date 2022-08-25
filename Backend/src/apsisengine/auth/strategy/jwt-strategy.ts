import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef, ContextIdFactory } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { KnexErrorService } from 'src/apsisengine/common/knexerrors';
import { KNEX_CONNECTION } from 'src/knexmodule';
import { AuthService } from '../auth.service';
import { jwtConstants } from '../constants';
import { JwtPayloadInterface } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(KNEX_CONNECTION) private readonly knex,
    private moduleRef: ModuleRef,
    private readonly knexErrorService: KnexErrorService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: JwtPayloadInterface) {
    const token = req.headers.authorization.split(' ')[1];
    const token_data = await this.knex('sys_user_tokens')
      .where({
        user_id: payload.user_id,
        status: 1,
        access_token: token,
      })
      .first()
      .catch((error) => this.knexErrorService.errorMessage(error.message));

    if (!token_data) {
      throw new UnauthorizedException('Invalid Token!');
    }
    //get request context id
    const contextId = ContextIdFactory.getByRequest(req);
    //resolve module reference of auth service
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    const user = await authService.validateJwtStrtegyUser(payload);

    if (!user) {
      throw new UnauthorizedException('Unauthorized Access!');
    }

    return payload;
  }
}
