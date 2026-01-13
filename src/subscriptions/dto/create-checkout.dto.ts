import { IsMongoId } from 'class-validator';

export class CreateCheckoutDto {
  @IsMongoId()
  planId: string;
}
