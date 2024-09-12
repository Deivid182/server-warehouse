import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from  "passport-local";
import { AuthService } from "../auth.service";
import { AuthPayloadDto } from "../dto/authpayload.dto";
import { User } from "src/users/schemas/user.schema";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  constructor(private readonly authService: AuthService) {
    // override usernameField which is set by default to username
    super({
      usernameField: "email",
    })
  }


  async validate(email: string, password: string): Promise<User> {
    return await this.authService.validateCredentials({ email, password })
  }
}