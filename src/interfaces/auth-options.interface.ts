import { Type } from "@nestjs/common";
import { UserService } from "./auth-service.interface";
import { JwtModuleOptions } from "@nestjs/jwt";

export interface AuthModuleOptions<D extends object, U> {
  userService: Type<UserService<D, U>>;
  jwt: JwtModuleOptions;
  inject?: any[];
}

export interface AuthOption<D extends object, U> {
  userService: Type<UserService<D, U>>;
  jwt: JwtModuleOptions;
  inject?: any[];
}

export interface AuthOptionFactory<D extends object, U> {
  create(options: AuthAsyncOptions<D, U>): AuthOption<D, U> | Promise<AuthOption<D, U>>;
}

export interface AuthAsyncOptions<D extends object, U> {
  useFactory: (...args: any[]) => Promise<AuthOption<D, U>> | AuthOption<D, U>;
  inject?: any[];
}
