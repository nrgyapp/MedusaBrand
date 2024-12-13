import { Router } from "express"
import { ConfigModule, MedusaContainer } from "@medusajs/medusa/dist/types/global"
import { ModuleExports } from "@medusajs/modules-sdk"
import { Brand } from "./models/brand"
import { BrandStats } from "./models/brand-stats"
import { BrandRepository } from "./repository/brand"
import { BrandStatsRepository } from "./repository/brand-stats"
import { BrandService } from "./services/brand"
import loadBrand from "./loaders/brand"
import adminRoutes from "./api/admin/brand"
import storeRoutes from "./api/store/brand"
import { registerOverriddenValidators } from "@medusajs/medusa"

// Export types and models
export * from "./types/brand"
export * from "./types/errors"
export * from "./models/brand"
export * from "./models/brand-stats"
export * from "./utils/image"
export * from "./utils/query"
export * from "./utils/search"
export * from "./utils/transform"
export * from "./utils/validators"
export * from "./services/brand"
export * from "./middleware/error/api-error"

export const moduleDefinition: ModuleExports = {
  service: BrandService,
  loaders: [loadBrand],
  migrations: [__dirname + "/migrations/*.{js,ts}"],
  models: [Brand, BrandStats],
  repositories: [BrandRepository, BrandStatsRepository],
  runMigrations: async () => {
    // Migration logic will be handled by Medusa core
    return Promise.resolve()
  },
  adminRoutes,
  storeRoutes,
}

export default async (
  container: MedusaContainer,
  configModule: ConfigModule
): Promise<void> => {
  registerOverriddenValidators(container)

  container.registerAdd("models", Brand)
  container.registerAdd("repositories", BrandRepository)
  container.registerAdd("repositories", BrandStatsRepository)
  container.registerAdd("services", BrandService)

  await loadBrand(container)
}