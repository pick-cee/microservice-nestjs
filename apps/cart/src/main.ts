import { NestFactory } from '@nestjs/core';
import { CartModule } from './cart.module';
import { QueueService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(CartModule);
  const queueSvc = app.get<QueueService>(QueueService);
  const configSvc = app.get(ConfigService);
  app.connectMicroservice(queueSvc.getOptions('product'));
  app.connectMicroservice(queueSvc.getOptions('cart'));
  app.connectMicroservice(queueSvc.getOptions('order'));
  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservices();
  await app.listen(configSvc.get('PORT'));
}
bootstrap();
