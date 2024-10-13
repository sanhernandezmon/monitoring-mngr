import { Test, TestingModule } from '@nestjs/testing';
import { SqsService } from './sqs.service';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { IncidentService } from '../../incident/incident.service';

const incidentSercviceMock = jest.fn().mockReturnValue({UpdateIncident: jest.fn(), CreateIncident: jest.fn()})

describe('SqsService', () => {
  let service: SqsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SqsService, ConfigService, {provide: IncidentService, useValue: incidentSercviceMock}],
    }).compile();

    service = module.get<SqsService>(SqsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
