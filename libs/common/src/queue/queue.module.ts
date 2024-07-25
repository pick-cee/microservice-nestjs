import { DynamicModule, Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

interface RmqModuleOptions {
  name: string;
}

@Module({
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: QueueModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configSvc: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configSvc.get<string>('RABBIT_URI')],
                queue: configSvc.get<string>(`RABBIT_${name}_QUEUE`),
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
