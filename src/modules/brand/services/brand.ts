import { TransactionBaseService } from "@medusajs/medusa"
import { BrandRepository } from "../repository/brand"
import { CreateBrandInput, UpdateBrandInput } from "../types/brand"
import { FindConfig, Selector } from "@medusajs/medusa/dist/types/common"
import { validateBrandName } from "../utils/validators"
import { processImage, validateImageUrl } from "../utils/image"
import { prepareBrandQuery } from "../utils/query"
import { buildBrandSearchQuery, buildBrandFilterQuery } from "../utils/search"
import { serializeBrand, SerializedBrand } from "../utils/transform"
import { MedusaError } from "@medusajs/utils"
import { MedusaContainer } from "@medusajs/medusa/dist/types/global"
import { BrandStatsRepository } from "../repository/brand-stats"

export class BrandService extends TransactionBaseService {
  protected brandRepository_: typeof BrandRepository
  protected brandStatsRepository_: typeof BrandStatsRepository
  protected readonly container: any

  constructor(container: MedusaContainer) {
    super(container)
    this.brandRepository_ = container.brandRepository
    this.brandStatsRepository_ = container.brandStatsRepository
    this.container = container
  }

  async list(
    selector: Selector<Brand> = {}, 
    config: FindConfig<Brand> = {}
  ): Promise<SerializedBrand[]> {
    const brandRepo = this.activeManager_.withRepository(this.brandRepository_)
    
    let query = prepareBrandQuery(selector, config)
    
    // Apply search if provided
    if (selector.search) {
      query = buildBrandSearchQuery(selector.search as string, query)
    }
    
    // Apply filters if provided
    if (selector.filters) {
      query = buildBrandFilterQuery(selector.filters as Record<string, unknown>, query)
    }
    
    const brands = await brandRepo.find(query)
    return brands.map(serializeBrand)
  }

  async retrieve(brandId: string): Promise<Brand> {
    const brandRepo = this.activeManager_.withRepository(this.brandRepository_)
    const brand = await brandRepo.findOne({ where: { id: brandId } })

    if (!brand) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Brand with id: ${brandId} not found`
      )
    }

    return brand
  }

  async create(data: CreateBrandInput): Promise<Brand> {
    const brandRepo = this.activeManager_.withRepository(this.brandRepository_)
    validateBrandName(data.name)

    // Process image if provided
    let processedImage = null
    if (data.image?.url) {
      validateImageUrl(data.image.url)
      processedImage = await processImage(data.image.url, {
        preset: "original" // This will generate all variants
      })
      processedImage.alt = data.image.alt || data.name
    }

    const existing = await brandRepo.findOne({ 
      where: { name: data.name }
    })
    
    if (existing) {
      throw new MedusaError(
        MedusaError.Types.DUPLICATE_ERROR,
        `Brand with name ${data.name} already exists`
      )
    }
    
    const brand = brandRepo.create({
      ...data,
      image: processedImage
    })
    return await brandRepo.save(brand)
  }
  
  async search(
    searchTerm: string,
    config: FindConfig<Brand> = {}
  ): Promise<SerializedBrand[]> {
    const brandRepo = this.activeManager_.withRepository(this.brandRepository_)
    const query = buildBrandSearchQuery(searchTerm, config)
    const brands = await brandRepo.find(query)
    return brands.map(serializeBrand)
  }
  
  async listWithFilters(
    filters: Record<string, unknown>,
    config: FindConfig<Brand> = {}
  ): Promise<SerializedBrand[]> {
    const brandRepo = this.activeManager_.withRepository(this.brandRepository_)
    const brands = await brandRepo.findWithFilters(filters, config)
    return brands.map(serializeBrand)
  }

  async update(brandId: string, data: UpdateBrandInput): Promise<Brand> {
    const brandRepo = this.activeManager_.withRepository(this.brandRepository_)
    const brand = await this.retrieve(brandId)
    
    if (data.name) {
      validateBrandName(data.name)
      
      const existing = await brandRepo.findOne({ 
        where: { name: data.name }
      })
      
      if (existing && existing.id !== brandId) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          `Brand with name ${data.name} already exists`
        )
      }
    }

    // Process new image if provided
    if (data.image?.url) {
      validateImageUrl(data.image.url)
      const processedImage = await processImage(data.image.url)
      processedImage.alt = data.image.alt || brand.name
      brand.image = processedImage
    }

    Object.assign(brand, data)
    return await brandRepo.save(brand)
  }

  async delete(brandId: string): Promise<void> {
    const brandRepo = this.activeManager_.withRepository(this.brandRepository_)
    const brand = await this.retrieve(brandId)
    await this.updateStats(brandId, "delete")
    
    // Check if brand has associated products
    const productsCount = await brandRepo
      .createQueryBuilder("brand")
      .leftJoin("brand.products", "product")
      .where("brand.id = :brandId", { brandId })
      .getCount()
    
    if (productsCount > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Cannot delete brand with associated products`
      )
    }
    
    await brandRepo.remove(brand)
  }

  async bulkCreate(
    data: CreateBrandInput[]
  ): Promise<Brand[]> {
    const brandRepo = this.activeManager_.withRepository(this.brandRepository_)
    const brands: Brand[] = []

    for (const brandData of data) {
      validateBrandName(brandData.name)
      
      // Process image if provided
      let processedImage = null
      if (brandData.image?.url) {
        validateImageUrl(brandData.image.url)
        processedImage = await processImage(brandData.image.url, {
          preset: "original"
        })
        processedImage.alt = brandData.image.alt || brandData.name
      }
      
      const brand = brandRepo.create({
        ...brandData,
        image: processedImage
      })
      
      brands.push(brand)
    }
    
    const savedBrands = await brandRepo.save(brands)
    await Promise.all(savedBrands.map(b => this.updateStats(b.id, "create")))
    return savedBrands
  }

  async bulkUpdate(
    updates: { id: string; data: UpdateBrandInput }[]
  ): Promise<Brand[]> {
    const brandRepo = this.activeManager_.withRepository(this.brandRepository_)
    const updatedBrands: Brand[] = []

    for (const { id, data } of updates) {
      const brand = await this.retrieve(id)
      
      if (data.name) {
        validateBrandName(data.name)
      }

      if (data.image?.url) {
        validateImageUrl(data.image.url)
        const processedImage = await processImage(data.image.url)
        data.image = processedImage
      }

      Object.assign(brand, data)
      updatedBrands.push(brand)
    }
    
    const saved = await brandRepo.save(updatedBrands)
    await Promise.all(saved.map(b => this.updateStats(b.id, "update")))
    return saved
  }

  async bulkDelete(brandIds: string[]): Promise<void> {
    const brandRepo = this.activeManager_.withRepository(this.brandRepository_)
    const brands = await Promise.all(
      brandIds.map(id => this.retrieve(id))
    )
    
    await Promise.all(brands.map(b => this.updateStats(b.id, "delete")))
    await brandRepo.remove(brands)
  }

  private validateStatsAction(action: string): asserts action is "create" | "update" | "delete" {
    if (!["create", "update", "delete"].includes(action)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Invalid stats action: ${action}`
      )
    }
  }

  private async updateStats(
    brandId: string,
    action: "create" | "update" | "delete"
  ): Promise<void> {
    this.validateStatsAction(action)

    const statsRepo = this.activeManager_.withRepository(this.brandStatsRepository_)
    const date = new Date()
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    let stats = await statsRepo.findOne({ 
      where: { brand_id: brandId, month }
    })
    
    if (!stats) {
      stats = statsRepo.create({ brand_id: brandId, month })
    }
    
    switch (action) {
      case "create":
        stats.created_count = (stats.created_count || 0) + 1
        break
      case "update":
        stats.updated_count = (stats.updated_count || 0) + 1
        break
      case "delete":
        stats.deleted_count = (stats.deleted_count || 0) + 1
        break
    }
    
    await statsRepo.save(stats)
  }
  
  async attachToProduct(
    brandId: string,
    productId: string
  ): Promise<void> {
    const productService = this.container.productService
    const product = await productService.retrieve(productId)
    
    await productService.update(productId, {
      brand_id: brandId
    })
  }
}