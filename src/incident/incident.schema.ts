import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Incident extends Document {
  @Prop({ default: () => uuidv4() })
  id: string;

  @Prop({ required: true })
  inputChannel: string;

  @Prop({
    type: {
      id: String,
      name: String,
      level: Number,
    },
    required: true,
  })
  assignedTo: { id: string; name: string; level: number };

  @Prop({
    type: {
      id: String,
      name: String,
      plan: Number,
    },
    required: true,
  })
  company: { id: string; name: string; plan: number };

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  state: number;
}

export const IncidentSchema = SchemaFactory.createForClass(Incident);
