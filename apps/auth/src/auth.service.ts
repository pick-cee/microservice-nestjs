import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserRequest, LoginRequestDto } from './dto';
import * as argon from 'argon2';
import { User } from '@app/common';
import { AuthRepository } from './auth.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private jwtSvc: JwtService,
    private configSvc: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async googleAuth(request: CreateUserRequest) {
    try {
      const userExists = await this.userModel.findOne({ email: request.email });
      if (!userExists) {
        const user = await this.authRepo.create(request);
        return await this.signToken(
          user._id,
          user.email,
          user.firstName,
          user.lastName,
          user.phoneNumber,
        );
      }

      return await this.signToken(
        userExists._id,
        userExists.email,
        userExists.firstName,
        userExists.lastName,
        userExists.phoneNumber,
      );
    } catch (err) {
      throw err;
    }
  }

  async signUp(request: CreateUserRequest) {
    try {
      const userExists = await this.userModel.findOne({ email: request.email });
      if (userExists) {
        throw new BadRequestException('User email already exists');
      }

      const hash = await argon.hash(request.password);
      const newUser = await this.authRepo.create({
        ...request,
        password: hash,
      });
      return newUser;
    } catch (err) {
      throw err;
    }
  }

  async signIn(signIn: LoginRequestDto) {
    const user = await this.userModel.findOne({ email: signIn.email });
    if (!user) {
      throw new NotFoundException('Incorrect email');
    }
    const pwMatches = await argon.verify(user.password, signIn.password);
    if (!pwMatches) {
      throw new ForbiddenException('Password incorrect');
    }
    delete user.password;

    return await this.signToken(
      user._id,
      user.email,
      user.firstName,
      user.lastName,
      user.phoneNumber,
    );
  }

  async changePassword(userId: any, password: any) {
    const userExists = await this.userModel.findOne({ _id: userId });
    if (userExists) {
      throw new BadRequestException('User email already exists');
    }

    const hash = await argon.hash(password);
    const updateUser = await this.authRepo.findOneAndUpdate(
      { _id: userId },
      { password: hash },
    );

    return updateUser;
  }

  async signToken(
    userId: any,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      userId,
      email,
      firstName,
      lastName,
      phoneNumber,
    };
    const secret = this.configSvc.get<string>('JWT_SECRET');
    const expiresIn = this.configSvc.get<number>('JWT_EXPIRATION');

    const token = await this.jwtSvc.signAsync(payload, {
      expiresIn: `${expiresIn}m`,
      secret: secret,
    });

    return {
      accessToken: token,
    };
  }
}
