import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsUUID()
  @IsOptional()
  scholarshipId?: string;
}

export class ExplainDto {
  @IsUUID()
  @IsNotEmpty()
  scholarshipId!: string;
}
