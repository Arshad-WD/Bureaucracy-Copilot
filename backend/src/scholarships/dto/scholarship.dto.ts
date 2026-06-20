import { IsString, IsOptional, IsInt, Min, IsUUID } from 'class-validator';

export class SearchScholarshipDto {
  @IsString()
  @IsOptional()
  keyword?: string;

  @IsString()
  @IsOptional()
  state?: string;
}

export class SaveScholarshipDto {
  @IsUUID()
  scholarshipId!: string;
}

export class CreateApplicationDto {
  @IsUUID()
  scholarshipId!: string;

  @IsString()
  status!: string; // INTERESTED, PREPARING_DOCUMENTS, APPLIED, etc.
}

export class UpdateApplicationDto {
  @IsString()
  status!: string;
}
