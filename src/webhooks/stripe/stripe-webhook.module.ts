import { Module } from '@nestjs/common';
import { StripeModule } from 'src/stripe/stripe.module';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { StripeWebhookController } from './stripe-webhook.controller';

@Module({
  imports: [StripeModule, SubscriptionsModule],
  controllers: [StripeWebhookController],
})
export class StripeWebhookModule {}
