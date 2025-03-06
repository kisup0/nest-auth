import { Inject } from "@nestjs/common";
import { AUTH_SERVICE, NON_BLOCKING } from "../auth.constants";
import { AuthControllerOptions } from "../interfaces/auth-service.interface";

function setAuthMetadata(
  target: any,
  options: AuthControllerOptions,
): void {
  for (const name in options) {
    Reflect.defineMetadata(NON_BLOCKING, options[name].nonBlock, target);
  }
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


export const InjectAuthService = () => Inject(AUTH_SERVICE);
