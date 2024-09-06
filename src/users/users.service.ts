import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
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
    const user = (await this.userModel.findOne(query))
    if(!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async getUsers() {
    return await this.userModel.find().exec();
  }

  async updateUser(query: FilterQuery<User>, data: UpdateQuery<User>) {
    return this.userModel.findOneAndUpdate(query, data)
  }
}
