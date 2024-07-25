import { Injectable } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UpdateUserRequest } from './dto/update-user.request';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@app/common';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async updateUser(userId: any, updateUser: UpdateUserRequest) {
    try {
      const user = await this.userRepo.findOneAndUpdate(
        { _id: userId },
        updateUser,
      );
      return user;
    } catch (err) {
      throw err;
    }
  }

  async findOne(userId: any) {
    return this.userModel.findOne({ _id: userId });
  }
}
