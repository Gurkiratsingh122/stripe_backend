import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StripeService } from 'src/stripe/stripe.service';
import { Plan, PlanDocument } from 'src/plans/plans.schema';
import { Subscription, SubscriptionDocument } from './subscriptions.schema';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly stripe: StripeService,

    @InjectModel(Plan.name)
    private readonly planModel: Model<PlanDocument>,

    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<SubscriptionDocument>,
  ) {}

  // 🔹 New subscription
  async subscribeUser(userId: string, planId: string, paymentMethodId: string) {
    const plan = await this.planModel.findOne({ _id: planId });
    if (!plan) {
      throw new BadRequestException('Invalid plan');
    }
console.log(userId, "user")
    // 1. Create Stripe customer
    const customer = await this.stripe.stripe.customers.create({
      metadata: { userId },
    });

    // 2. Attach payment method
    await this.stripe.stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    // 3. Set default payment method
    await this.stripe.stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // 4. Create subscription
    const stripeSub = await this.stripe.stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: plan.priceId }],
      expand: ['latest_invoice.payment_intent'],
    });

    // 5. Handle SCA if required
    // const paymentIntent = stripeSub.latest_invoice?.payment_intent as any;

    // if (paymentIntent?.status === 'requires_action') {
    //   return {
    //     requiresAction: true,
    //     clientSecret: paymentIntent.client_secret,
    //   };
    // }

    // 6. Save subscription in DB
    return this.createDbSubscription(
      userId,
      plan._id.toString(),
      customer.id,
      stripeSub.id,
    );
  }

  // 🔹 Re-subscribe expired user
  async resubscribeUser(userId: string, paymentMethodId: string) {
    const sub = await this.subscriptionModel.findOne({
      userId,
      status: 'expired',
    });

    if (!sub) {
      throw new BadRequestException('No expired subscription found');
    }

    await this.stripe.stripe.paymentMethods.attach(paymentMethodId, {
      customer: sub.stripeCustomerId!,
    });

    await this.stripe.stripe.customers.update(sub.stripeCustomerId!, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return { success: true };
  }

  // 🔹 DB helper
  private async createDbSubscription(
    userId: string,
    planId: string,
    customerId: string,
    stripeSubId: string,
  ) {
    await this.subscriptionModel.updateMany(
      { userId },
      { status: 'expired', endDate: new Date() },
    );

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    return this.subscriptionModel.create({
      userId,
      planId,
      status: 'active',
      startDate,
      endDate,
      stripeCustomerId: customerId,
      stripeSubscriptionId: stripeSubId,
    });
  }
}
