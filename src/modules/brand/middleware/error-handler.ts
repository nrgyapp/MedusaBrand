import { NextFunction, Request, Response } from "express"
import { MedusaError } from "@medusajs/utils"

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error instanceof MedusaError) {
    res.status(error.status || 400).json({
      type: error.type,
      message: error.message
    })
    return
  }

  res.status(500).json({
    message: "An unknown error occurred."
  })
}