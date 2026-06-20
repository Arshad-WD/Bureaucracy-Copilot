import { IsNumber, IsOptional, IsString, IsBoolean, Min, Max } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(120)
  age?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  educationLevel?: string;

  @IsOptional()
  @IsString()
  institutionType?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  annualIncome?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsBoolean()
  disability?: boolean;
}
