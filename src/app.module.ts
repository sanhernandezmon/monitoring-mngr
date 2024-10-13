// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IncidentService } from './incident/incident.service';
import { SqsService } from './infrastructure/sqs.service';
import { Incident, IncidentSchema } from './incident/incident.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([
      { name: Incident.name, schema: IncidentSchema },
    ]),
  ],
  providers: [IncidentService, SqsService],
})
export class AppModule {}
