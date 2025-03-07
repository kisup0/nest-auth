import { Injectable, Inject } from "@nestjs/common";
import { JwtModuleOptions, JwtService } from "@nestjs/jwt";
import { USER_SERVICE, JWT_MODULE_OPTIONS } from "../auth.constants";
import { JwtPayload, UserService } from "../interfaces/auth-service.interface";


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

  async validateAccessToken(token: string|undefined): Promise<U|null> {
    if(!token) {
      return null;
    }
    try {
      const result = await this.jwtService.verifyAsync<P & JwtPayload>(token);
      if(result.token_type !== 'access') {
        return null;
      }
      const user = await this.userService.findUserAuth(this.cleanPayload(result));
      return user;
    } catch {
      return null;
    }
  }

  async replaceAccessToken(refreshToken: string): Promise<string> {
    const payload = await this.validateRefreshToken(refreshToken);
    if(!payload) {
      return null;
    }
    return this.generateAccessToken(payload);
  }

  async validateRefreshToken(token: string|undefined): Promise<P|null> {
    if(!token) {
      return null;
    }
    try {
      const result = await this.jwtService.verifyAsync<P & JwtPayload>(token);
      if(result.token_type !== 'refresh') {
        return null;
      }
      return this.cleanPayload(result);
    } catch {
      return null;
    }
  }
  async generateAccessToken(payload: P): Promise<string> {
    return this.jwtService.signAsync({
      ...this.cleanPayload(payload),
      token_type: 'access',
    });
  }

  async generateRefreshToken(payload: P): Promise<string> {
    return this.jwtService.signAsync({
      ...this.cleanPayload(payload),
      token_type: 'refresh',
    }, {
      expiresIn: '1y',
    });
  }

  private cleanPayload(payload: P | P & JwtPayload): P {
    const { exp:_, iat:__, token_type:___, ...rest } = payload as P & JwtPayload;
    return rest as P;
  }
}
