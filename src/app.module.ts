import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IncidentModule } from './incident/incident.module';
import { SqsModule } from '@ssut/nestjs-sqs';
import { InfraestructureModule } from './infraestructure/infraestructure.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb+srv://monitoring-mngr:A9IJ20qntWFsW7k9@cluster0.knwczvb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      }),
    }),
    IncidentModule,
    SqsModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        consumers: [
          {
            name: 'Kpi-update', // The SQS queue name
            queueUrl: 'https://sqs.us-east-2.amazonaws.com/908027377460/Kpi-update', // The SQS queue URL
            region: 'us-east-2', // AWS region
          },
        ],
        producers: [],
      }),
    }),
    InfraestructureModule,
  ],
  providers: [],
})
export class AppModule {}
