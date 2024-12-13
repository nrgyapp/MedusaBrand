import { validate } from "class-validator"
import { plainToClass } from "class-transformer"
import { ValidationError } from "../error/api-error"

export async function validateClass(schema: any, data: any): Promise<void> {
  const instance = plainToClass(schema, data)
  const errors = await validate(instance)
  
  if (errors.length > 0) {
    const messages = errors
      .map(error => Object.values(error.constraints))
      .flat()
      .join(", ")
      
    throw new ValidationError(messages)
  }
}