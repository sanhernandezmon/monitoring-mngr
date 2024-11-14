import { Injectable, Logger, NotFoundException } from '@nestjs/common'; 
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { IncidentService } from '../../incident/incident.service';
import { Message } from '@aws-sdk/client-sqs';
import { UpdateIncidentDto } from '../../incident/dto/update.incident.dto';

@Injectable()
export class SqsService {

    constructor(
      private readonly incidentService: IncidentService,
    ){}

    @SqsMessageHandler('Kpi-update')
    async handleUpdateIncidentMessage(message: Message) {
      try {
        const messageBody = JSON.parse(message.Body); 
    
        const incidentMessage = JSON.parse(messageBody.Message); 
    
        const updateIncidentDto: UpdateIncidentDto = {
          id: incidentMessage.id,
          timestamp: incidentMessage.timestamp,
          clientId: incidentMessage.client_id,
          state: incidentMessage.state,
          companyId: incidentMessage.company_id,
          description: incidentMessage.description || null,
        };
    
        await this.incidentService.updateIncident(updateIncidentDto);
    
        Logger.log(`Update Incident processed successfully: ${JSON.stringify(updateIncidentDto)}`);
      } catch (error) {
        Logger.error(`Failed to process update incident SQS message: ${error.message}`);
      }
    }
}
