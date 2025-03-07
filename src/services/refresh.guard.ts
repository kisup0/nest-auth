import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../services/auth.service';
import { REFRESH_TOKEN_KEY } from '../auth.constants';
import { InjectAuthService } from '../decorators/auth.decorators';
import { AuthException } from '../auth.exception';
@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    @InjectAuthService() private authService: AuthService<any, any>,
    @Inject(Reflector.name) protected readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isRefreshToken = this.reflector.get<boolean>(
      REFRESH_TOKEN_KEY,
      context.getHandler()
    );

    if (!isRefreshToken) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const queryToken = request.query.token;
    
    const refreshToken = authHeader?.split(' ')[1] || queryToken;
    if (!refreshToken) {
      throw new AuthException();
    }

    const newAccessToken = await this.authService.replaceAccessToken(refreshToken);
    if (!newAccessToken) {
      throw new AuthException();
    }

    request.newAccessToken = newAccessToken;
    
    return true;
  }
}
