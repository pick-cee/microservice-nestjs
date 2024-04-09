import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueueService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const queueSvc = app.get<QueueService>(QueueService);
  app.useGlobalPipes(new ValidationPipe());
  const config = app.get(ConfigService);
  app.connectMicroservice(queueSvc);
  await app.startAllMicroservices();
  await app.listen(config.get('PORT'));
}
bootstrap();
