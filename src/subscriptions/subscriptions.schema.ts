import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ ref: 'User', required: true }) userId: string;
  @Prop({ ref: 'Plan', required: true }) planId: string;

  @Prop({ required: true }) status: 'active' | 'expired';
  @Prop({ required: true }) startDate: Date;
  @Prop({ required: true }) endDate: Date;

  @Prop() stripeCustomerId?: string;
  @Prop() stripeSubscriptionId?: string;
}


export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);