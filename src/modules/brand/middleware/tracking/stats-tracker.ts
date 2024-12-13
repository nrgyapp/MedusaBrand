import { NextFunction, Request, Response } from "express"
import { BrandService } from "../../services/brand"

export function trackBrandView() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const brandId = req.params.id
      if (brandId) {
        const brandService: BrandService = req.scope.resolve("brandService")
        // Update view count asynchronously
        brandService.updateStats(brandId, "view").catch(console.error)
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}