import { Brand as MedusaBrand } from "@medusajs/medusa"
import { ImageFormat } from "../utils/image"

export interface Brand extends MedusaBrand {
  name: string
  description: string | null
  image: BrandImage | null
  metadata: Record<string, unknown> | null
}

export interface BrandImage {
  url: string
  width?: number
  height?: number
  alt?: string
  format?: ImageFormat
  size?: number
}

export interface CreateBrandInput {
  name: string
  description?: string
  image?: BrandImage
  metadata?: Record<string, unknown>
}

export interface UpdateBrandInput extends Partial<CreateBrandInput> {}

export interface SerializedBrand {
  id: string
  name: string
  description?: string
  image?: BrandImage
  product_count: number
  created_at: Date
  updated_at: Date
  metadata?: Record<string, unknown>
}

export interface BrandStats {
  id: string
  brand_id: string
  month: string
  created_count: number
  updated_count: number
  deleted_count: number
  view_count: number
  product_attachment_count: number
  created_at: Date
  updated_at: Date
}