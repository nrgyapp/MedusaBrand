import { NextFunction, Request, Response } from "express"
import { MedusaError } from "@medusajs/utils"
import { ApiError } from "./api-error"

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error for debugging
  console.error("Error:", {
    name: error.name,
    message: error.message,
    stack: error.stack
  })

  if (error instanceof ApiError) {
    res.status(error.status).json({
      type: error.type,
      message: error.message,
      details: error.stack
    })
    return
  }

  if (error instanceof MedusaError) {
    res.status(error.status || 400).json({
      type: error.type,
      message: error.message
    })
    return
  }

  // Log unexpected errors
  console.error("Unexpected error:", error)
  
  res.status(500).json({
    type: "internal_error",
    message: "An unexpected error occurred"
  })
}