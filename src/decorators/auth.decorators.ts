import { createParamDecorator, ExecutionContext, Inject, SetMetadata } from "@nestjs/common";
import { AUTH_SERVICE, NON_BLOCKING, REFRESH_TOKEN_KEY } from "../auth.constants";
import { AuthControllerOptions } from "../interfaces/auth-service.interface";

function setAuthMetadata(
  target: any,
  options: AuthControllerOptions,
): void {
  Reflect.defineMetadata(NON_BLOCKING, options.nonBlock, target);
}

export const Auth = (options: AuthControllerOptions): MethodDecorator & ClassDecorator => {
  return (
    target: any,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>
  ) => {
    if (descriptor) {
      setAuthMetadata(descriptor.value, options);
      return descriptor;
    }
    setAuthMetadata(target, options);
    return target;
  };
};

export const AuthUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

export const UseRefreshToken = () => SetMetadata(REFRESH_TOKEN_KEY, true);

export const Refresh = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.newAccessToken;
  },
);
export const InjectAuthService = () => Inject(AUTH_SERVICE);
