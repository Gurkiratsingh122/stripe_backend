import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlanDocument = Plan & Document;

@Schema({ timestamps: true })
export class Plan {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  interval: string;

  @Prop({ required: true })
  todoLimit: number;

  @Prop({ required: true })
  durationInDays: number;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ default: true })
  isActive: boolean;

  // Stripe price ID
  @Prop()
  priceId?: string;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
