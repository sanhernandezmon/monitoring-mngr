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

    if (incident) {
      incident.history.push({ state, timestamp, polygonHash, polygonCount });
      await incident.save();
    } else {
      const newIncident = new this.incidentModel(updateIncidentDto);
      await newIncident.save();
    }
  }

  async getIncidentById(id: string): Promise<Incident> {
    const incident = await this.incidentModel.findById(id);
    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
    return incident;
  }
}
