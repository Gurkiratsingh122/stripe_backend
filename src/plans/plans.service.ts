import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plan, PlanDocument } from './plans.schema';
import { CreatePlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan.name)
    private readonly planModel: Model<PlanDocument>,
  ) {}

  async getAllPlans() {
    return this.planModel.find({ isActive: true }).sort({ amount: 1 }).lean();
  }

  async createPlan(dto: CreatePlanDto) {
    const existing = await this.planModel.findOne({ name: dto.name });
    if (existing) {
      throw new ConflictException('Plan with this name already exists');
    }

    const plan = await this.planModel.create(dto);
    return plan;
  }
}
