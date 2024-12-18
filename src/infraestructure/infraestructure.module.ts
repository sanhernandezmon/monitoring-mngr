import { Module } from '@nestjs/common';
import { SqsService } from './sqs/sqs.service';
import { IncidentModule } from 'src/incident/incident.module';
import { PinataService } from './pinata/pinata.service';
import { PolygonService } from './blockChain/block-chain.service';
import { SnsService } from './sns/sns.service';

@Module({
  imports: [
    IncidentModule
  ],
  providers: [
    SqsService,
    PinataService,
    PolygonService,
    SnsService,
  ]
})
export class InfraestructureModule {}
