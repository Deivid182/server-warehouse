import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { FilterQuery, Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async registerUser(registerDto: RegisterDto) {
    const user = await new this.userModel({
      ...registerDto,
      password: await hash(registerDto.password, 10)
    }).save();
    const { password, ...userWithoutPassword } = user.toObject();

    return userWithoutPassword
  }

  async findUser(query: FilterQuery<User>) {
    console.log(query)
    const user = (await this.userModel.findOne(query))
    console.log(user)
    if(!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }
}
