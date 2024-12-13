import { MedusaError } from "@medusajs/utils"

export function validateBrandName(name: string): void {
  if (name.length < 2) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Brand name must be at least 2 characters long"
    )
  }
  
  if (name.length > 50) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Brand name cannot exceed 50 characters"
    )
  }
}

export function validateLogoUrl(url: string): void {
  try {
    new URL(url)
  } catch (e) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "Invalid logo URL format"
    )
  }
}