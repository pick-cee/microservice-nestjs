import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserRequest, LoginRequestDto } from './dto';
import { GoogleOauthGuard, JwtGuard } from './guards';
import { Response } from 'express';
import { GetUser } from '@app/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() request: CreateUserRequest) {
    return await this.authService.signUp(request)
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async logIn(@Body() request: LoginRequestDto) {
    return await this.authService.signIn(request)
  }

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthGuard(@Req() request, @Res() res: Response) {
    const token = await this.authService.googleAuth(request.user)

    return res.status(200).json(token)
  }

  @Put('update-password')
  @UseGuards(JwtGuard)
  async updatePassword(
    @GetUser('userId') userId: any,
    @Body() password: string
  ) {
    return await this.authService.changePassword(userId, password)
  }
}
