import { BeforeInsert, Column, Entity } from "typeorm"
import { BaseEntity, generateEntityId } from "@medusajs/medusa"
import { BrandImage } from "../types/brand"

@Entity()
export class Brand extends BaseEntity {
  @Column({ type: "varchar" })
  name!: string

  @Column({ type: "varchar", nullable: true })
  description!: string | null

  @Column({ type: "jsonb", nullable: true })
  image!: BrandImage | null

  @Column({ type: "jsonb", nullable: true })
  metadata!: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "brand")
  }
}