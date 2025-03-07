import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthExceptionFilter } from './services/auth.fillter';
import { AuthGuard } from './services/auth.guard';

export * from './auth.module';
export * from './interfaces/auth-options.interface';
export * from './interfaces/auth-service.interface';
export * from './auth.constants';
export * from './services/auth.guard';
export * from './services/auth.service';
export * from './auth.exception';
export * from './services/auth.fillter';
export * from './decorators/auth.decorators';
export * from './services/refresh.guard';

export const AuthProviders = [
  {
    provide: APP_FILTER,
    useClass: AuthExceptionFilter,
  },
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
];
