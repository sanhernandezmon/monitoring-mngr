import { Injectable, Logger, NotFoundException } from '@nestjs/common'; 
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { IncidentService } from '../../incident/incident.service';
import { Message } from '@aws-sdk/client-sqs';
import { UpdateIncidentDto } from '../../incident/dto/update.incident.dto';
import { PinataService } from '../pinata/pinata.service';
import { PolygonService } from '../blockChain/block-chain.service';

@Injectable()
export class SqsService {

    constructor(
      private readonly incidentService: IncidentService,
      private readonly pinataService: PinataService,
      private readonly polygonService: PolygonService
    ){}

    @SqsMessageHandler('Kpi-update')
    async handleUpdateIncidentMessage(message: Message) {
      try {
        const messageBody = JSON.parse(message.Body); 
        const incidentMessage = JSON.parse(messageBody.Message); 
        let incident
        try {
          incident = await this.incidentService.getIncidentById(Number(incidentMessage.id))
        } catch (error) {
          incident = {
            id: incidentMessage.id,
            timestamp: incidentMessage.timestamp,
  
            clientId: incidentMessage.client_id,
            state: incidentMessage.state,
            companyId: incidentMessage.company_id,
            description: incidentMessage.description || null,
          }
        }
        const pinataHash = await this.pinataService.uploadIncident(incident)
        const poligonHash = await this.polygonService.uploadHashToPolygon(pinataHash);

        const updateIncidentDto: UpdateIncidentDto = {
          id: incidentMessage.id,
          timestamp: incidentMessage.timestamp,

          clientId: incidentMessage.client_id,
          state: incidentMessage.state,
          companyId: incidentMessage.company_id,
          description: incidentMessage.description || null,
          polygonHash: poligonHash.hash,
          polygonCount: poligonHash.hashCount
        };
    
        await this.incidentService.updateIncident(updateIncidentDto);
        Logger.log(`Update Incident processed successfully: ${JSON.stringify(updateIncidentDto)}`);
      } catch (error) {
        Logger.error(`Failed to process update incident SQS message: ${error.message}`);
      }
    }
}