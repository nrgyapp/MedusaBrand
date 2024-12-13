import { NextFunction, Request, Response } from "express"
import { validate as classValidate } from "class-validator"
import { plainToClass } from "class-transformer"
import { MedusaError } from "@medusajs/utils"

export function validate(schema: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const input = plainToClass(schema, req.body)
    
    const errors = await classValidate(input)
    
    if (errors.length > 0) {
      const message = errors
        .map(error => Object.values(error.constraints))
        .flat()
        .join(", ")
        
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        message
      )
    }
    
    next()
  }
}