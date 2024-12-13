import { MedusaError } from "@medusajs/utils"

export class ApiError extends MedusaError {
  public status: number

  constructor(type: string, message: string, status = 400) {
    super(type, message)
    this.status = status
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(MedusaError.Types.INVALID_DATA, message, 400)
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string, id: string) {
    super(
      MedusaError.Types.NOT_FOUND,
      `${resource} with id ${id} not found`,
      404
    )
  }
}