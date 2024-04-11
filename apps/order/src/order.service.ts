import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  getHello(): string {
    return 'Hello World!';
  }

  async handleProductCreated(data: any) {
    this.logger.log('Product....', data)
  }
}
