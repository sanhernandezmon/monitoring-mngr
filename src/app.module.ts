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
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
    }),
    IncidentModule,
    SqsModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        consumers: [
          {
            name: configService.get<string>('SQS_QUEUE_NAME'), // The SQS queue name
            queueUrl: configService.get<string>('SQS_QUEUE_URL'), // The SQS queue URL
            region: configService.get<string>('AWS_REGION'), // AWS region
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
