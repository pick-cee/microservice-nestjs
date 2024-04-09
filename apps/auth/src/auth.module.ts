import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleOauthGuard, JwtGuard } from './guards';
import { GoogleStrategy, JwtStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule, QueueModule, User, UserSchema } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi'
import { AuthRepository } from './auth.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.number().required(),
        CLIENT_ID: Joi.string().required(),
        CLIENT_SECRET: Joi.string().required(),
        CALLBACK_URL: Joi.string().required(),
      }),
      envFilePath: './apps/auth/.env'
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${config.get('JWT_EXPIRATION')}s`
        }
      }),
      inject: [ConfigService]
    }),
    DatabaseModule,
    QueueModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, GoogleOauthGuard, JwtStrategy, GoogleStrategy, AuthRepository],
})
export class AuthModule { }
