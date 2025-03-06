import { DynamicModule, Module, Provider } from "@nestjs/common";
import { AUTH_SERVICE, JWT_MODULE_OPTIONS, USER_SERVICE } from "./auth.constants";
import { AuthAsyncOptions, AuthModuleOptions } from "./interfaces/auth-options.interface";
import { AuthService } from "./services/auth.service";

@Module({})
export class AuthModule {
  static forRoot<D extends object, U>(options: AuthModuleOptions<D, U>): DynamicModule {
    const userServiceProvider:Provider = {
      provide: USER_SERVICE,
      useClass: options.userService,
    };
    const jwtServiceProvider:Provider = {
      provide: JWT_MODULE_OPTIONS,
      useValue: options.jwt,
    };
    const authServiceProvider:Provider = {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    };

    const providers:Provider[] = [
      userServiceProvider,
      jwtServiceProvider,
      authServiceProvider,
    ];
    
    return {
      module: AuthModule,
      providers: [
        ...providers,
        ...options.inject,
      ],
      exports: providers,
      global: true,
    };
  }

  static forRootAsync<D extends object, U>(options: AuthAsyncOptions<D, U>): DynamicModule {
    const providers:Provider[] = [
      this.createAuthServiceProvider(),
      this.createUserServiceAsyncProvider<D, U>(options),
      this.createJwtServiceProvider<D, U>(options),
    ];

    return {
      module: AuthModule,
      providers: [
        ...providers,
        ...options.inject,
      ],
      exports: providers,
      global: true,
    };
  }
  private static createAuthServiceProvider(): Provider {
    return {
      provide: AUTH_SERVICE,
      useClass: AuthService,
    };
  }

  private static createUserServiceAsyncProvider<D extends object, U>(
    options: AuthAsyncOptions<D, U>
  ): Provider {
    return {
      provide: USER_SERVICE,
      useFactory: async(...args: any[])=>{
        const config = await options.useFactory(...args);
        return {
          provide: USER_SERVICE,
          useClass: config.userService,
        };
      },
      inject: options.inject,
    };
  }
  
  private static createJwtServiceProvider<D extends object, U>(
    options: AuthAsyncOptions<D, U>
  ): Provider {
    return {
      provide: JWT_MODULE_OPTIONS,
      useFactory: async(...args: any[])=>{
        const config = await options.useFactory(...args);
        return config.jwt;
      },
    };
  }
}
