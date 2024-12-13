import { EntityRepository, Repository } from "typeorm"
import { BrandStats } from "../models/brand-stats"

@EntityRepository(BrandStats)
export class BrandStatsRepository extends Repository<BrandStats> {
  async getMonthlyStats(
    brandId: string,
    month: string
  ): Promise<BrandStats | undefined> {
    return await this.findOne({
      where: { brand_id: brandId, month }
    })
  }

  async getBrandStats(
    brandId: string,
    months: number = 12
  ): Promise<BrandStats[]> {
    return await this.find({
      where: { brand_id: brandId },
      order: { month: "DESC" },
      take: months
    })
  }
}