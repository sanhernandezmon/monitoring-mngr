import { Injectable, Logger, NotFoundException } from '@nestjs/common'; 
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { IncidentService } from '../../incident/incident.service';
import { CreateIncidentDto } from '../../incident/dto/create.incident.dto';
import { Message } from '@aws-sdk/client-sqs';
import { UpdateIncidentDto } from '../../incident/dto/update.incident.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SqsService {
    private readonly createQueueUrl: string;
    private readonly updateQueueUrl: string;

    constructor(
      private readonly incidentService: IncidentService,
      private readonly configService: ConfigService,
    ) {
      this.createQueueUrl = this.configService.get<string>('SQS_CREATE_QUEUE_URL');
      this.updateQueueUrl = this.configService.get<string>('SQS_UPDATE_QUEUE_URL');

      if (!this.createQueueUrl || !this.updateQueueUrl) {
        throw new NotFoundException('Queue URLs are not defined in the environment variables.');
      }
    }

    @SqsMessageHandler('CREATE-INCIDENT-SQS')
    async handleCreateIncidentMessage(message: Message) {
        try {
            const createIncidentDto: CreateIncidentDto = JSON.parse(message.Body);
            await this.incidentService.createIncident(createIncidentDto);
            Logger.log(`Create Incident processed successfully: ${JSON.stringify(createIncidentDto)}`);
        } catch (error) {
            Logger.error(`Failed to process create incident SQS message: ${error.message}`);
        }
    }

    @SqsMessageHandler('UPDATE-INCIDENT-SQS')
    async handleUpdateIncidentMessage(message: Message) {
        try {
            const updateIncidentDto: UpdateIncidentDto = JSON.parse(message.Body);
            await this.incidentService.updateIncident(updateIncidentDto);
            Logger.log(`Update Incident processed successfully: ${JSON.stringify(updateIncidentDto)}`);
        } catch (error) {
            Logger.error(`Failed to process update incident SQS message: ${error.message}`);
        }
    }
}
