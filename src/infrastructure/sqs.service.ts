// sqs.service.ts
import { Injectable, Logger } from '@nestjs/common';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import { IncidentService } from '../incident/incident.service';

@Injectable()
export class SqsService {
  private readonly sqsClient = new SQSClient({ region: 'your-region' });
  private readonly logger = new Logger(SqsService.name);
  private readonly queueUrl = 'your-sqs-queue-url';

  constructor(private readonly incidentService: IncidentService) {}

  async listenToSqsMessages() {
    try {
      const receiveParams = {
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
      };

      const data = await this.sqsClient.send(
        new ReceiveMessageCommand(receiveParams),
      );
      if (data.Messages) {
        for (const message of data.Messages) {
          this.logger.log('Received SQS message', message.Body);

          const parsedBody = JSON.parse(message.Body);
          await this.processMessage(parsedBody);

          // After processing, delete the message from the queue
          await this.sqsClient.send(
            new DeleteMessageCommand({
              QueueUrl: this.queueUrl,
              ReceiptHandle: message.ReceiptHandle,
            }),
          );
        }
      }
    } catch (error) {
      this.logger.error('Error receiving or processing SQS message', error);
    }
  }

  private async processMessage(body: any) {
    if (body.eventType === 'create') {
      await this.incidentService.createIncident(body.incident);
    } else if (body.eventType === 'update') {
      await this.incidentService.updateIncident(
        body.incident.id,
        body.incident,
      );
    }
  }
}
