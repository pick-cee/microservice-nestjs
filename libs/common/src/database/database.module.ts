import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";


@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async (config: ConfigService) => {
                const uri = 'mongodb://127.0.0.1/oauth'
                return {
                    uri: uri
                }
            },
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule { }