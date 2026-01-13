import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';
import { SubscribeDto } from './dto/subscribe.dto';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) {}

  /**
   * Create NEW subscription (card collected on frontend)
   */
  @Post('subscribe')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async subscribe(@Req() req, @Body() dto: SubscribeDto) {
    const result = await this.service.subscribeUser(
      req.user.userId,
      dto.planId,
      dto.paymentMethod,
    );

    return result;
  }

  /**
   * Update card / re-subscribe expired user
   */
  @Post('resubscribe')
  @UseGuards(JwtAuthGuard)
  async resubscribe(@Req() req, @Body('paymentMethod') paymentMethod: string) {
    const result = await this.service.resubscribeUser(
      req.user._id,
      paymentMethod,
    );

    return {
      statusCode: 200,
      message: 'Subscription updated successfully',
      data: result,
    };
  }
}
