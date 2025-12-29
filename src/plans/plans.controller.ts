import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  async getPlans() {
    const plans = await this.plansService.getAllPlans();
    return {
      statusCode: HttpStatus.OK,
      message: 'Plans fetched successfully',
      data: plans,
    };
  }

  @Post()
  async createPlan(@Body() dto: CreatePlanDto) {
    const plan = await this.plansService.createPlan(dto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Plan created successfully',
      data: plan,
    };
  }
}
