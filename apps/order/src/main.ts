import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';
import { QueueService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // const app = await NestFactory.create(OrderModule);
  // const queueSvc = app.get<QueueService>(QueueService);
  // app.useGlobalPipes(new ValidationPipe());
  // const config = app.get(ConfigService);
  // app.connectMicroservice(queueSvc.getOptions('product'));
  // await app.startAllMicroservices();
  // await app.listen(config.get('PORT'));

  const app = await NestFactory.create(OrderModule);
  const rmqService = app.get<QueueService>(QueueService);
  app.connectMicroservice(rmqService.getOptions('product'));
  await app.startAllMicroservices();
}
bootstrap();
