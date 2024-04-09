import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserRequest } from './dto/update-user.request';
import { GetUser } from '@app/common';
import { JwtGuard } from 'apps/auth/src/guards';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('user')
  getUser(@GetUser('userId') userId: any) {
    return this.usersService.findOne(userId);
  }

  @Put('update')
  updateUser(@GetUser('userId') userId: any, @Body() updateUser: UpdateUserRequest) {
    return this.usersService.updateUser(userId, updateUser)
  }
}
