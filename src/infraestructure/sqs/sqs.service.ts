import { Injectable, Logger, NotFoundException } from '@nestjs/common'; 
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { IncidentService } from '../../incident/incident.service';
import { Message } from '@aws-sdk/client-sqs';
import { UpdateIncidentDto } from '../../incident/dto/update.incident.dto';
import { PinataService } from '../pinata/pinata.service';
import { PolygonService } from '../blockChain/block-chain.service';
import { Incident } from 'src/incident/incident.schema';
import { SnsService } from '../sns/sns.service';

@Injectable()
export class SqsService {

    constructor(
      private readonly pinataService: PinataService,
      private readonly polygonService: PolygonService,
      private readonly snsService: SnsService,
    ){}

    @SqsMessageHandler('Kpi-update')
    async handleUpdateIncidentMessage(message: Message) {
      try {
        const messageBody = JSON.parse(message.Body); 
        const incidentMessage = JSON.parse(messageBody.Message); 
        const pinataHash = await this.pinataService.uploadIncident(incidentMessage)
        const pinataurl = `https://magenta-kind-lark-284.mypinata.cloud/ipfs/${pinataHash}`
        const poligonHash = await this.polygonService.uploadHashToPolygon(pinataurl);
        const polygonLink = `https://amoy.polygonscan.com/tx/${poligonHash.hash}`
        await this.snsService.publishMessage(
          {
            "Message" : "your transaction has been updated",
            "Transaction" : incidentMessage,
            "Confimation link" : polygonLink
          }
        )
        Logger.log(`Update Incident processed successfully: ${polygonLink}`);
      } catch (error) {
        Logger.error(`Failed to process update incident SQS message: ${error.message}`);
      }
    }
}