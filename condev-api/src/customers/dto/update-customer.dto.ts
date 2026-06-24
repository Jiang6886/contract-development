import { IsDateString, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator'

export class UpdateCustomerDto {
  @IsString()
  @MaxLength(160)
  companyName!: string

  @IsOptional()
  @IsString()
  @MaxLength(160)
  companyNameKana?: string | null

  @IsString()
  @MaxLength(80)
  representativeName!: string

  @IsOptional()
  @IsString()
  @MaxLength(10)
  postalCode?: string | null

  @IsString()
  @MaxLength(255)
  address!: string

  @IsOptional()
  @IsString()
  @MaxLength(120)
  buildingName?: string | null

  @IsString()
  @MaxLength(30)
  phoneNumber!: string

  @IsOptional()
  @IsString()
  @MaxLength(30)
  faxNumber?: string | null

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(255)
  siteUrl?: string | null

  @IsOptional()
  @IsString()
  @MaxLength(20)
  importance?: string | null

  @IsOptional()
  @IsDateString()
  contractConclusionDate?: string | null

  @IsOptional()
  @IsString()
  @MaxLength(80)
  primarySales?: string | null

  @IsOptional()
  @IsString()
  @MaxLength(80)
  secondarySales?: string | null

  @IsOptional()
  @IsString()
  remarks?: string | null
}
