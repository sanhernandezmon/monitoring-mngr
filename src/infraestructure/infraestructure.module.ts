import { Module } from '@nestjs/common';
import { SqsService } from './sqs/sqs.service';
import { IncidentService } from 'src/incident/incident.service';
import { IncidentModule } from 'src/incident/incident.module';

@Module({
  imports: [
    IncidentModule
  ],
  providers: [
    SqsService,
  ]
})
export class InfraestructureModule {}