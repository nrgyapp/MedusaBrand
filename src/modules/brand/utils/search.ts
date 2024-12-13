import { FindConfig } from "@medusajs/medusa/dist/types/common"
import { Not, IsNull, Like } from "typeorm"
import { Brand } from "../models/brand"

export function buildBrandSearchQuery(
  searchTerm: string,
  config: FindConfig<Brand> = {}
): FindConfig<Brand> {
  return {
    ...config,
    select: config.select,
    skip: config.skip,
    take: config.take,
    relations: config.relations,
    order: config.order,
    where: {
      ...(config.where || {}),
      name: Like(`%${searchTerm}%`),
      description: Like(`%${searchTerm}%`)
    }
  }
}

export function buildBrandFilterQuery(
  filters: Record<string, unknown>,
  config: FindConfig<Brand> = {}
): FindConfig<Brand> {
  const where = {
    ...(config.where || {})
  }
  
  if (filters.hasLogo === true) {
    where.image = Not(IsNull())
  }
  
  if (filters.hasProducts === true) {
    where.products = Not(IsNull())
  }
  
  return {
    ...config,
    select: config.select,
    skip: config.skip,
    take: config.take,
    relations: config.relations,
    order: config.order,
    where
  }
}