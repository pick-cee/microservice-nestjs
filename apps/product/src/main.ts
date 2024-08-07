import { NestFactory } from '@nestjs/core';
import { ProductModule } from './product.module';
import { QueueService } from '@app/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);
  const queueSvc = app.get<QueueService>(QueueService);
  app.useGlobalPipes(new ValidationPipe());
  const configSvc = app.get(ConfigService);
  app.connectMicroservice(queueSvc.getOptions('product'));
  await app.startAllMicroservices();
  await app.listen(configSvc.get('PORT'));
}
bootstrap();
