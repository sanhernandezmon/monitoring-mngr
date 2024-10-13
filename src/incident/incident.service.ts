import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Incident } from './incident.schema';
import { CreateIncidentDto } from './dto/create.incident.dto';
import { UpdateIncidentDto } from './dto/update.incident.dto';

@Injectable()
export class IncidentService {
  constructor(@InjectModel(Incident.name) private incidentModel: Model<Incident>) {}

  async createIncident(createIncidentDto: CreateIncidentDto): Promise<Incident> {
    const newIncident = new this.incidentModel(createIncidentDto);
    return newIncident.save();
  }

  async updateIncident(updateIncidentDto: UpdateIncidentDto): Promise<Incident> {
    const updatedIncident = await this.incidentModel.findByIdAndUpdate(updateIncidentDto.id, updateIncidentDto, { new: true });
    if (!updatedIncident) {
      throw new NotFoundException(`Incident with ID ${updateIncidentDto.id} not found`);
    }
    return updatedIncident;
  }
}
