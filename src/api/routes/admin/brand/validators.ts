import { 
  IsString, 
  IsOptional, 
  IsBoolean,
  IsObject,
  ValidateNested,
  IsUrl
  IsNumber,
} from "class-validator"
import { Type } from "class-transformer"

export class BrandImageInput {
  @IsUrl()
  url: string

  @IsNumber()
  @IsOptional()
  width?: number

  @IsNumber()
  @IsOptional()
  height?: number

  @IsString()
  @IsOptional()
  alt?: string
}

export class AdminPostBrandReq {
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  description?: string

  @ValidateNested()
  @Type(() => BrandImageInput)
  @IsOptional()
  image?: BrandImageInput

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class AdminPostBrandBrandReq {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  description?: string

  @ValidateNested()
  @Type(() => BrandImageInput)
  @IsOptional()
  image?: BrandImageInput

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>
}

export class BrandFilters {
  @IsBoolean()
  @IsOptional()
  hasLogo?: boolean

  @IsBoolean()
  @IsOptional()
  hasProducts?: boolean
}

export class AdminGetBrandsParams {
  @IsString()
  @IsOptional()
  search?: string

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => BrandFilters)
  filters?: BrandFilters
}