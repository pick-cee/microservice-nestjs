import { NestFactory } from '@nestjs/core';
import { OrderModule } from './order.module';
import { QueueService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);
  const rmqService = app.get<QueueService>(QueueService);
  app.useGlobalPipes(new ValidationPipe());
  const config = app.get(ConfigService);
  app.connectMicroservice(rmqService.getOptions('cart'));
  app.connectMicroservice(rmqService.getOptions('product'));
  app.connectMicroservice(rmqService.getOptions('order'));
  await app.startAllMicroservices();

  await app.listen(config.get('PORT'));
}
bootstrap();
