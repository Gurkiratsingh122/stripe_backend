import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsIn,
  Min,
  IsOptional,
} from 'class-validator';

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsIn(['month', 'trial'])
  interval: string;

  @IsNumber()
  todoLimit: number; // 5 | 50 | -1

  @IsNumber()
  @Min(1)
  durationInDays: number;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  stripePriceId?: string;
}
