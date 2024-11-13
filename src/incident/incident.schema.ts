import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IncidentDocument = Incident & Document;

@Schema()
export class Incident {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  timestamp: string;

  @Prop({ required: true })
  clientId: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  companyId: string;

  @Prop([{ state: String, timestamp: String, pinataHash: String }])
  history: { state: string; timestamp: string, pinataHash: string }[];
}

export const IncidentSchema = SchemaFactory.createForClass(Incident);
