import { MedusaError } from "@medusajs/utils"

export class BrandNotFoundError extends MedusaError {
  constructor(brandId: string) {
    super(
      MedusaError.Types.NOT_FOUND,
      `Brand with id: ${brandId} was not found`
    )
  }
}

export class DuplicateBrandError extends MedusaError {
  constructor(brandName: string) {
    super(
      MedusaError.Types.DUPLICATE_ERROR,
      `Brand with name: ${brandName} already exists`
    )
  }
}

export class InvalidBrandDataError extends MedusaError {
  constructor(message: string) {
    super(
      MedusaError.Types.INVALID_DATA,
      message
    )
  }
}

export class BrandValidationError extends MedusaError {
  constructor(message: string) {
    super(
      MedusaError.Types.INVALID_DATA,
      `Brand validation error: ${message}`
    )
  }
}

export class BrandImageError extends MedusaError {
  constructor(message: string) {
    super(
      MedusaError.Types.INVALID_DATA,
      `Brand image error: ${message}`
    )
  }
}