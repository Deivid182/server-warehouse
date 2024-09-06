import { Body, Controller, Post, Res, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async createUser(@Body() registerDto: RegisterDto) {
    return this.usersService.registerUser(registerDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@CurrentUser() user: User) {
    return this.usersService.getUsers();
  }
}
