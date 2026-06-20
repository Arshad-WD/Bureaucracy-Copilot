import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsBoolean, Min } from 'class-validator';

export class AdminCreateScholarshipDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  provider!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsString()
  @IsOptional()
  applicationUrl?: string;

  @IsString()
  @IsOptional()
  deadline?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsOptional()
  rules?: any;

  @IsArray()
  @IsOptional()
  documents?: { documentName: string; mandatory?: boolean }[];
}

export class AdminUpdateScholarshipDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @IsString()
  @IsOptional()
  applicationUrl?: string;

  @IsString()
  @IsOptional()
  deadline?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsOptional()
  rules?: any;

  @IsArray()
  @IsOptional()
  documents?: { documentName: string; mandatory?: boolean }[];
}
