import { Router } from "express"
import { BrandService } from "../../../.."
import { transformBody, transformQuery, wrapHandler } from "@medusajs/medusa"
import { errorHandler } from "../../../middleware/error/error-handler"
import { validateBody, validateQuery } from "../../../middleware/validation/request-validator"
import { trackBrandView } from "../../../middleware/tracking/stats-tracker"
import { 
  AdminPostBrandReq, 
  AdminPostBrandBrandReq,
  AdminPostBrandBulkReq,
  AdminPostBrandBulkUpdateReq,
  AdminPostBrandBulkDeleteReq,
  AdminGetBrandStatsParams
} from "../../../types/brand"

export default (router) => {
  const route = Router()
  router.use("/brands", route)

  // Add middleware
  route.use(errorHandler)
  route.use(validateBody)
  route.use(validateQuery)

  // List brands
  route.get(
    "/",
    transformQuery(AdminPostBrandReq),
    wrapHandler(async (req, res) => {
      const brandService: BrandService = req.scope.resolve("brandService")
      const [brands, count] = await brandService.listAndCount(req.query)
      res.json({ brands, count })
    })
  )

  // Get a brand
  route.get(
    "/:id",
    trackBrandView(),
    wrapHandler(async (req, res) => {
      const brandService: BrandService = req.scope.resolve("brandService")
      const brand = await brandService.retrieve(req.params.id)
      res.json({ brand })
    })
  )

  // Create brand
  route.post(
    "/",
    validateBody(AdminPostBrandBrandReq),
    wrapHandler(async (req, res) => {
      const brandService: BrandService = req.scope.resolve("brandService")
      const brand = await brandService.create(req.body)
      res.status(201).json({ brand })
    })
  )

  // Update brand
  route.post(
    "/:id",
    transformBody(AdminPostBrandBrandReq),
    wrapHandler(async (req, res) => {
      const brandService: BrandService = req.scope.resolve("brandService")
      const brand = await brandService.update(req.params.id, req.body)
      res.json({ brand })
    })
  )

  // Delete brand
  route.delete("/:id", wrapHandler(async (req, res) => {
    const brandService: BrandService = req.scope.resolve("brandService")
    await brandService.delete(req.params.id)
    res.status(200).end()
  }))
  
  // Bulk create brands
  route.post(
    "/bulk",
    transformBody(AdminPostBrandBulkReq),
    wrapHandler(async (req, res) => {
      const brandService: BrandService = req.scope.resolve("brandService")
      const brands = await brandService.bulkCreate(req.body.brands)
      res.json({ brands })
    })
  )

  // Bulk update brands
  route.post(
    "/bulk/update",
    transformBody(AdminPostBrandBulkUpdateReq),
    wrapHandler(async (req, res) => {
      const brandService: BrandService = req.scope.resolve("brandService")
      const brands = await brandService.bulkUpdate(req.body.updates)
      res.json({ brands })
    })
  )

  // Bulk delete brands
  route.post(
    "/bulk/delete",
    transformBody(AdminPostBrandBulkDeleteReq),
    wrapHandler(async (req, res) => {
      const brandService: BrandService = req.scope.resolve("brandService")
      await brandService.bulkDelete(req.body.brandIds)
      res.status(200).end()
    })
  )

  // Get brand statistics
  route.get(
    "/:id/stats",
    transformQuery(AdminGetBrandStatsParams),
    wrapHandler(async (req, res) => {
      const brandService: BrandService = req.scope.resolve("brandService")
      const stats = await brandService.getStats(
        req.params.id,
        req.query.months
      )
      res.json({ stats })
    })
  )
}