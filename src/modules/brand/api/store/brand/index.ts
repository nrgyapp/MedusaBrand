import { Router } from "express"
import { BrandService } from "../../../services/brand"
import { transformQuery } from "@medusajs/medusa"
import { errorHandler } from "../../../middleware/error/error-handler"
import { validateQuery } from "../../../middleware/validation/request-validator"
import { trackBrandView } from "../../../middleware/tracking/stats-tracker"
import { GetBrandsParams } from "./validators"

export default (router: Router) => {
  const route = Router()
  router.use("/brands", route)

  // Add middleware
  route.use(errorHandler)

  // List brands
  route.get(
    "/",
    validateQuery(GetBrandsParams),
    trackBrandView(),
    async (req, res) => {
      const brandService: BrandService = req.scope.resolve("brandService")
      const brands = await brandService.list(req.query)
      res.json({ brands })
    }
  )

  // Get a brand
  route.get("/:id", async (req, res) => {
    const brandService: BrandService = req.scope.resolve("brandService")
    const brand = await brandService.retrieve(req.params.id)
    res.json({ brand })
  })

  return router
}