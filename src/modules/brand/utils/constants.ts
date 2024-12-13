export const BRAND_NAME_MIN_LENGTH = 2
export const BRAND_NAME_MAX_LENGTH = 50

export const IMAGE_FORMATS = ['webp', 'jpeg', 'png'] as const
export const DEFAULT_IMAGE_FORMAT = 'webp'

export const STATS_ACTIONS = ['create', 'update', 'delete'] as const

export const ERROR_MESSAGES = {
  INVALID_NAME_LENGTH: (min: number, max: number) => 
    `Brand name must be between ${min} and ${max} characters`,
  DUPLICATE_NAME: (name: string) => 
    `Brand with name ${name} already exists`,
  INVALID_IMAGE_URL: 'Invalid image URL format',
  PRODUCTS_EXIST: 'Cannot delete brand with associated products'
} as const