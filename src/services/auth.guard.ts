
import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { NON_BLOCKING, REFRESH_TOKEN_KEY } from '../auth.constants';
import { AuthService } from './auth.service';
import { InjectAuthService } from '../decorators/auth.decorators';
import { AuthException } from '../auth.exception';

@Injectable()
export class AuthGuard<D extends object, U> implements CanActivate {
  constructor(
    @InjectAuthService() private authService: AuthService<D, U>,
    @Inject(Reflector.name) protected readonly reflector: Reflector
  ) {
  }
  async onModuleInit() {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isRefreshToken = this.reflector.get<boolean>(REFRESH_TOKEN_KEY, context.getHandler());
    const nonBlocking = this.reflector.getAllAndOverride<boolean>(NON_BLOCKING, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const user = isRefreshToken ?
      await this.authService.validateRefreshToken(token) :
      await this.authService.validateAccessToken(token);

    if(user) {
      request['user'] = user;
      return true;
    }else if(nonBlocking) {
      return true;
    }else {
      throw new AuthException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
