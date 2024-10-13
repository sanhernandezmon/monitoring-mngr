import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Incident extends Document {

  @Prop({ required: true })
  initialDate: Date;

  @Prop()
  resolutionDate?: Date;

  @Prop({ required: true })
  clientId: string;

  @Prop({ required: true })
  incidentType: string;

  @Prop({ required: true })
  companyId: string;

  @Prop({ required: true })
  asignee: string;

  @Prop()
  description?: string;
}

export const IncidentSchema = SchemaFactory.createForClass(Incident);
