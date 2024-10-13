import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentService } from './incident.service';
import { Incident, IncidentSchema } from './incident.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Incident.name, schema: IncidentSchema }])],
  providers: [IncidentService],
  exports: [IncidentService],
})
export class IncidentModule {}
