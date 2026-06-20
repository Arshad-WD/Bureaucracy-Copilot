import { IsString, IsOptional, IsNumber, IsBoolean, Min } from 'class-validator';

export class CheckEligibilityDto {
  @IsString()
  @IsOptional()
  state?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  annualIncome?: number;

  @IsString()
  @IsOptional()
  educationLevel?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsBoolean()
  @IsOptional()
  disability?: boolean;
}
