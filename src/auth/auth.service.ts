import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/authpayload.dto';
import { UsersService } from 'src/users/users.service';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schemas/user.schema';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response: Response) {
    const expireAccessToken = new Date();
    expireAccessToken.setMilliseconds(
      expireAccessToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const expireRefreshToken = new Date();
    expireRefreshToken.setMilliseconds(
      expireRefreshToken.getTime() +
        parseInt(
          this.configService.getOrThrow<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION_MS',
          ),
        ),
    );

    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS')}ms`,
    });

    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRATION_MS')}ms`
    })

    await this.usersService.updateUser(
      { _id: user._id },
      { $set: { refreshToken: await hash(refreshToken, 10) } }
    )

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expireAccessToken
    })
    response.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      expires: expireRefreshToken
    })
    response.status(200).json({
      message: 'User logged in successfully',
      data: {
        role: user.role,
        email: user.email
      },
      success: true
    })
  }

  async validateCredentials({ email, password }: AuthPayloadDto) {
    try {
      const userFound = await this.usersService.findUser({ email });

      const auth = await compare(password, userFound.password);
      if (!auth) {
        throw new UnauthorizedException();
      }
      return userFound;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  async validateUserRefreshToken(refreshToken: string, userId: string) {
    try {
      const userFound = await this.usersService.findUser({ _id: userId });
      const auth = await compare(refreshToken, userFound.refreshToken);
      if(auth === false){
        throw new UnauthorizedException();
      }
      return userFound;
    } catch (error) {
      throw new UnauthorizedException("RefreshToken not valid");
    }
  }

  async invalidateJWT(userId: string, response: Response) {
    try {
      const userFound = await this.usersService.findUser({ _id: userId });
      await this.usersService.updateUser(
        { _id: userFound._id },
        { $set: { refreshToken: null } }
      );
      response.clearCookie('Authentication')
      response.clearCookie('Refresh')
      return response.end()
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
