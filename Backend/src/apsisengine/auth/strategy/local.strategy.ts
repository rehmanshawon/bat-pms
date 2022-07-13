import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private moduleRef: ModuleRef) {
    super({ usernameField: 'user', passReqToCallback: true });
  }

  async validate(req, user: string, password: string): Promise<any> {
    //get request context id
    const contextId = ContextIdFactory.getByRequest(req);
    //resolve module reference of auth service
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    const user_data = await authService.validateLocalUser(req, user, password);
    if (!user_data) {
      throw new UnauthorizedException('Unauthorized access!');
    }
    return user_data;
  }
}
