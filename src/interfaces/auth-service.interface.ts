export interface UserService<P extends object, U> {
  findUserAuth (payload:P): Promise<U | null>;
}

export interface AuthControllerOptions {
  nonBlock?: boolean;
}
