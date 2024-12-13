import { EntityRepository, Repository, Not, IsNull } from "typeorm"
import { Brand } from "../models/brand"

@EntityRepository(Brand)
export class BrandRepository extends Repository<Brand> {
  async findByName(
    name: string,
    options = {}
  ): Promise<Brand | undefined> {
    return await this.findOne({
      where: { name },
      ...options,
    })
  }
  
  async findWithProducts(
    brandId: string,
    options = {}
  ): Promise<Brand | undefined> {
    return await this.findOne({
      where: { id: brandId },
      relations: ["products"],
      ...options,
    })
  }
  
  async findWithFilters(
    filters: Record<string, unknown>,
    options = {}
  ): Promise<Brand[]> {
    const qb = this.createQueryBuilder("brand")
    
    if (filters.hasLogo) {
      qb.andWhere("brand.image IS NOT NULL")
    }
    
    if (filters.hasProducts) {
      qb.leftJoin("brand.products", "product")
        .andWhere("product.id IS NOT NULL")
    }
    
    return qb.getMany()
  }
}