import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlanDocument = Plan & Document;

@Schema({ timestamps: true })
export class Plan {
  @Prop({ required: true })
  name: string; // Free | Pro | Unlimited

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number; // 0 | 10 | 15

  @Prop({ required: true })
  interval: string; // month | trial

  @Prop({ required: true })
  todoLimit: number; // 5 | 50 | -1

  @Prop({ required: true })
  durationInDays: number; // 7 | 30

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: false })
  priceId?: string;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
