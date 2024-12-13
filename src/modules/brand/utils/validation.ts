import { BrandValidationError } from '../types/errors'
import { BRAND_NAME_MIN_LENGTH, BRAND_NAME_MAX_LENGTH, ERROR_MESSAGES } from './constants'

export function validateBrandInput(input: Record<string, any>): void {
  if (!input) {
    throw new BrandValidationError('Input is required')
  }

  if (input.name) {
    if (typeof input.name !== 'string') {
      throw new BrandValidationError('Name must be a string')
    }

    if (input.name.length < BRAND_NAME_MIN_LENGTH || input.name.length > BRAND_NAME_MAX_LENGTH) {
      throw new BrandValidationError(
        ERROR_MESSAGES.INVALID_NAME_LENGTH(BRAND_NAME_MIN_LENGTH, BRAND_NAME_MAX_LENGTH)
      )
    }
  }

  if (input.metadata && typeof input.metadata !== 'object') {
    throw new BrandValidationError('Metadata must be an object')
  }
}