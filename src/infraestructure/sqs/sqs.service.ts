import { Injectable, Logger, NotFoundException } from '@nestjs/common'; 
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { IncidentService } from '../../incident/incident.service';
import { Message } from '@aws-sdk/client-sqs';
import { UpdateIncidentDto } from '../../incident/dto/update.incident.dto';
import { PinataService } from '../pinata/pinata.service';
import { PolygonService } from '../blockChain/block-chain.service';
import { Incident } from 'src/incident/incident.schema';

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
        let incident: Incident
        let wasCreated: boolean
        try {
          incident = await this.incidentService.getIncidentById(Number(incidentMessage.id))
          wasCreated = true;
        } catch (error) {
          incident = {
            id: incidentMessage.id,
            timestamp: incidentMessage.timestamp,
            clientId: incidentMessage.client_id,
            state: incidentMessage.state,
            companyId: incidentMessage.company_id,
            history: [{
              state: "CREATED",
              timestamp: incidentMessage.timestamp,
            },]
          }
          wasCreated = false
        }
        if(wasCreated){
          incident.history.push({
            state: incidentMessage.state,
            timestamp: incidentMessage.timestamp
          })
          const pinataHash = await this.pinataService.uploadIncident(incident)
          const poligonHash = await this.polygonService.uploadHashToPolygon(pinataHash);
          const updateIncidentDto: UpdateIncidentDto = {
            id: incidentMessage.id,
            state: incidentMessage.state,
            timestamp: incidentMessage.timestamp,
            polygonHash: poligonHash.hash,
            polygonCount: poligonHash.hashCount        
          }
          await this.incidentService.updateIncident(updateIncidentDto);
        }else{
          const pinataHash = await this.pinataService.uploadIncident(incident)
          const poligonHash = await this.polygonService.uploadHashToPolygon(pinataHash);
          incident.history.find((history) => history.timestamp === incidentMessage.timestamp).polygonHash = poligonHash.hash
          incident.history.find((history) => history.timestamp === incidentMessage.timestamp).polygonCount = poligonHash.hashCount
          await this.incidentService.createIncident(incident);

        }
        Logger.log(`Update Incident processed successfully: ${incident}`);
      } catch (error) {
        Logger.error(`Failed to process update incident SQS message: ${error.message}`);
      }
    }
}