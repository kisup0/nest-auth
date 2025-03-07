import { JwtType } from "../auth.constants";

export interface UserService<P extends object, U> {
  findUserAuth (payload:P): Promise<U | null>;
}

export interface AuthControllerOptions {
  nonBlock?: boolean;
}

export interface JwtPayload{
  iat: number;
  exp: number;
  token_type: JwtType;
}
