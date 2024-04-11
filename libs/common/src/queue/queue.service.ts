import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RmqContext, RmqOptions, Transport } from "@nestjs/microservices";


@Injectable()
export class QueueService {
    constructor(private readonly configSvc: ConfigService) { }

    getOptions(queue: string, noAck = false): RmqOptions {
        return {
            transport: Transport.RMQ,
            options: {
                urls: [this.configSvc.get<string>('RABBIT_URI')],
                queue: this.configSvc.get<string>(`RABBIT_${queue}_QUEUE`),
                noAck,
                persistent: true
            }
        }
    }

    async ack(context: RmqContext) {
        const channel = context.getChannelRef()
        const originalMessage = context.getMessage()
        channel.ack(originalMessage)
    }
}