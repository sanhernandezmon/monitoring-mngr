// incident.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident } from './incident.schema';

@Injectable()
export class IncidentService {
  constructor(
    @InjectModel(Incident.name) private readonly incidentModel: Model<Incident>,
  ) {}

  async createIncident(incidentData: Partial<Incident>): Promise<Incident> {
    const createdIncident = new this.incidentModel(incidentData);
    return createdIncident.save();
  }

  async updateIncident(
    id: string,
    incidentData: Partial<Incident>,
  ): Promise<Incident> {
    const updatedIncident = await this.incidentModel.findOneAndUpdate(
      { id },
      incidentData,
      { new: true },
    );
    if (!updatedIncident) {
      throw new Error(`Incident with id ${id} not found`);
    }
    return updatedIncident;
  }
}
