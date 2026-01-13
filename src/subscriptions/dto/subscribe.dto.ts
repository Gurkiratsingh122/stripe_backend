import { IsMongoId, IsString } from 'class-validator';

export class SubscribeDto {
  @IsMongoId()
  planId: string;

  @IsString()
  paymentMethod: string;

  @IsString()
  priceId: string;
}
