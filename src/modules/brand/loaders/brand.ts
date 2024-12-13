import { MedusaContainer } from "@medusajs/medusa/dist/types/global"
import { BrandService } from "../services/brand"
import { logger } from "../utils/logger"

export default async (
  container: MedusaContainer,
  config: Record<string, unknown> = {}
): Promise<void> => {
  try {
    const brandService: BrandService = container.resolve("brandService")
    
    // Register any necessary subscribers or event handlers
    const eventBusService = container.resolve("eventBusService")
    eventBusService.subscribe("product.created", async (data: unknown) => {
      logger.info("Product created event received", { data })
      // Handle product creation events if needed
    })
    
  } catch (err) {
    logger.error("Failed to load brand module", err)
    throw err
  }
}