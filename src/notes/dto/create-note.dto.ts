import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsMongoId()
  categoryId: string;

  @IsMongoId()
  @IsOptional()
  userId?: string;
}
