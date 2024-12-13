import { Router } from "express"
import { BrandService } from "../../../.."
import { transformBody, transformQuery, wrapHandler } from "@medusajs/medusa"
import { 
  AdminPostBrandReq, 
  AdminPostBrandBrandReq,
  AdminGetBrandsParams 
} from "./validators"

export default (router: Router) => {
  const route = Router()
  router.use("/brands", route)

  // List brands
  route.get(
    "/",
    transformQuery(AdminGetBrandsParams),
    wrapHandler(async (req, res) => {
      const brandService: BrandService = req.scope.resolve("brandService")
      
      // Handle search
      if (req.query.search) {
        const brands = await brandService.search(req.query.search)
        return res.json({ brands })
      }
      
      // Handle filters
      if (req.query.filters) {
        const brands = await brandService.listWithFilters(req.query.filters)
        return res.json({ brands })
      }
      
      // Default list
      const brands = await brandService.list(req.query)
      res.json({ brands })
    })
  )

  // Get a brand
  route.get("/:id", wrapHandler(async (req, res) => {
    const brandService: BrandService = req.scope.resolve("brandService")
    const brand = await brandService.retrieve(req.params.id)
    res.json({ brand })
  }))

  // Create a brand
  route.post(
    "/",
    transformBody(AdminPostBrandReq),
    wrapHandler(async (req, res) => {
      const brandService: BrandService = req.scope.resolve("brandService")
      const brand = await brandService.create(req.body)
      res.json({ brand })
    })
  )

  // Update a brand
  route.post(
    "/:id",
    transformBody(AdminPostBrandBrandReq),
    wrapHandler(async (req, res) => {
      const brandService: BrandService = req.scope.resolve("brandService")
      const brand = await brandService.update(req.params.id, req.body)
      res.json({ brand })
    })
  )

  // Delete a brand
  route.delete("/:id", wrapHandler(async (req, res) => {
    const brandService: BrandService = req.scope.resolve("brandService")
    await brandService.delete(req.params.id)
    res.status(200).end()
  }))
  
  // Attach brand to product
  route.post(
    "/:id/products/:productId",
    wrapHandler(async (req, res) => {
      const brandService: BrandService = req.scope.resolve("brandService")
      await brandService.attachToProduct(req.params.id, req.params.productId)
      res.status(200).end()
    })
  )

  return router
}