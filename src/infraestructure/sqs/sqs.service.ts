import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { IncidentService } from '../../incident/incident.service';
import { CreateIncidentDto } from '../../incident/dto/create.incident.dto';
import { Message } from '@aws-sdk/client-sqs';
import { UpdateIncidentDto } from 'src/incident/dto/update.incident.dto';
import { ConfigService } from '@nestjs/config/dist/config.service';


@Injectable()

export class SqsService {
    private readonly queueName: string;

    constructor(
      private readonly incidentService: IncidentService,
      private readonly configService: ConfigService,
    ) {
      this.queueName = this.configService.get<string>('SQS_QUEUE_NAME');
    }
  @SqsMessageHandler(process.env.SQS_CREATE_QUEUE_NAME)
  async handleCreateIncidentMessage(message: Message ) {
    try {
      const createIncidentDto: CreateIncidentDto = JSON.parse(message.Body);
      await this.incidentService.createIncident(createIncidentDto);

      Logger.log(`Incident processed successfully: ${JSON.stringify(createIncidentDto)}`);
    } catch (error) {
      Logger.error(`Failed to process SQS message: ${error.message}`);
    }
  }

  @SqsMessageHandler(process.env.SQS_CREATE_QUEUE_NAME)
  async handleUpdateIncidentMessage(message: Message ) {
    try {
      const updateIncidentDto: UpdateIncidentDto = JSON.parse(message.Body);
      await this.incidentService.updateIncident(updateIncidentDto);

      Logger.log(`Incident processed successfully: ${JSON.stringify(updateIncidentDto)}`);
    } catch (error) {
      Logger.error(`Failed to process SQS message: ${error.message}`);
    }
  }
}
