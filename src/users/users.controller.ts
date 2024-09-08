import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from './schemas/user.schema';
import { ApiTags, ApiResponse, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @ApiBody({
    type: RegisterDto,
    description: 'Json structure for user object',
  })
  @ApiCreatedResponse({
    status: 201,
    description: 'Created',
    type: UserEntity
  })
  @ApiResponse({
    status: 400,
    description: 'User already exists',
  })
  async createUser(@Body() registerDto: RegisterDto) {
    return this.usersService.registerUser(registerDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUsers(@CurrentUser() user: User) {
    return this.usersService.getUsers();
  }
}
