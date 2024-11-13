import { Module } from '@nestjs/common';
import { SqsService } from './sqs/sqs.service';
import { IncidentModule } from 'src/incident/incident.module';
import { PinataService } from './pinata/pinata.service';
import { PolygonService } from './blockChain/block-chain.service';

@Module({
  imports: [
    IncidentModule
  ],
  providers: [
    SqsService,
    PinataService,
    PolygonService,
  ]
})
export class InfraestructureModule {}
