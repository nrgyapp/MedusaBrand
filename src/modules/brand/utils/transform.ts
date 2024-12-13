import { Brand } from "../models/brand"
import { SerializedBrand } from "../types/brand"

export function serializeBrand(brand: Brand): SerializedBrand {
  return {
    id: brand.id,
    name: brand.name,
    description: brand.description || undefined,
    image: brand.image || undefined,
    product_count: 0, // This will be populated by the service layer
    created_at: brand.created_at,
    updated_at: brand.updated_at,
    metadata: brand.metadata || undefined
  }
}