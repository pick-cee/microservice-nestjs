import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        const uri = config.get<string>('MONGODB_URI');
        return {
          uri: uri,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
