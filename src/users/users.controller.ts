import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async createUser(@Res() response: Response, @Body() registerDto: RegisterDto) {
    const userCreated = await this.usersService.registerUser(registerDto);
    return response.status(HttpStatus.CREATED).json({
      message: 'User registered successfully',
      data: userCreated,
      success: true
    })
  }
}
