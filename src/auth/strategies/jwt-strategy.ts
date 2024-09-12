import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../interfaces/token-payload.interface";
import { UsersService } from "src/users/users.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.Authentication
      ]),
      secretOrKey: configService.getOrThrow("JWT_ACCESS_TOKEN_SECRET"),
    })
  }
  // Involves checking the digital signature of the JWT to ensure its integrity and validating claims to determine the user’s identity and permissions.
  async validate(payload: TokenPayload) {
    return this.usersService.findUser({ _id: payload.userId })
  }
}