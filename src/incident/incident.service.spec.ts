import { Test, TestingModule } from '@nestjs/testing';
import { IncidentService } from './incident.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident } from './incident.schema';
const mockIncidentModel = {
  findByIdAndUpdate: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('IncidentService', () => {
  let service: IncidentService;
  let incidentModel: Model<Incident>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentService,
        {
          provide: getModelToken(Incident.name),
          useValue: mockIncidentModel,
        },
      ],
    }).compile();

    service = module.get<IncidentService>(IncidentService);
    incidentModel = module.get<Model<Incident>>(getModelToken(Incident.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Additional tests can be added here
});
