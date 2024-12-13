import { FindConfig } from "@medusajs/medusa/dist/types/common"
import { Brand } from "../models/brand"

export function prepareBrandQuery(
  query: Record<string, unknown>,
  config: FindConfig<Brand> = {}
): FindConfig<Brand> {
  const limit = typeof query.limit === 'number' ? query.limit : 10
  const offset = typeof query.offset === 'number' ? query.offset : 0
  const order = { created_at: "DESC" as const }

  return {
    ...config,
    skip: offset,
    take: limit,
    order,
    relations: [...(config.relations || []), "products"],
  }
}