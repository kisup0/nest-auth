import { Injectable, Inject } from "@nestjs/common";
import { JwtModuleOptions, JwtService } from "@nestjs/jwt";
import { USER_SERVICE, JWT_MODULE_OPTIONS } from "../auth.constants";
import { UserService } from "../interfaces/auth-service.interface";


@Injectable()
export class AuthService<P extends object, U> {
  jwtService: JwtService;
  constructor(
    @Inject(USER_SERVICE) private readonly userService: UserService<P, U>,
    @Inject(JWT_MODULE_OPTIONS) private readonly jwtModuleOptions: JwtModuleOptions,
  ) {
  }
  async onModuleInit() {
    this.jwtService = new JwtService(this.jwtModuleOptions);
  }

  async validateToken(token: string|undefined): Promise<P|null> {
    if(!token) {
      return null;
    }
    try {
      const result = await this.jwtService.verifyAsync<P>(token);
      return result;
    } catch {
      return null;
    }
  }

}
