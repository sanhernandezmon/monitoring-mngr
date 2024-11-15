import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident } from './incident.schema';
import { UpdateIncidentDto } from './dto/update.incident.dto';

@Injectable()
export class IncidentService {
  constructor(@InjectModel(Incident.name) private incidentModel: Model<Incident>) {}

  async updateIncident(updateIncidentDto: UpdateIncidentDto): Promise<void> {
    const { id, timestamp, state, polygonHash, polygonCount } = updateIncidentDto;

    const incident = await this.incidentModel.findOne({ id });
      incident.history.push({ state, timestamp, polygonHash, polygonCount });
      await incident.save();
  }

  async createIncident(incident: Incident): Promise<void> {
      const newIncident = new this.incidentModel(incident);
      await newIncident.save();
  }

  async getIncidentById(id: number): Promise<Incident> {
    const incident = await this.incidentModel.findOne({ id }).exec();
    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
    return incident;
  }
}
