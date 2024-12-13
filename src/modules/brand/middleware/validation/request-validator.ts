import { NextFunction, Request, Response } from "express"
import { validateClass } from "./class-validator"

export function validateBody(schema: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validateClass(schema, req.body)
      next()
    } catch (error) {
      next(error)
    }
  }
}

export function validateQuery(schema: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await validateClass(schema, req.query)
      next()
    } catch (error) {
      next(error)
    }
  }
}