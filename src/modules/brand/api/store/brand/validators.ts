import { IsString, IsOptional } from "class-validator"

export class GetBrandsParams {
  @IsString()
  @IsOptional()
  search?: string

  @IsString()
  @IsOptional()
  order?: string
}