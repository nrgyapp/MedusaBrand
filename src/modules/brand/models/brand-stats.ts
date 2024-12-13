import { Column, Entity, Index } from "typeorm"
import { BaseEntity } from "@medusajs/medusa"

@Entity()
export class BrandStats extends BaseEntity {
  @Index()
  @Column()
  brand_id!: string

  @Index()
  @Column()
  month!: string

  @Column({ type: "int", default: 0 })
  created_count!: number

  @Column({ type: "int", default: 0 })
  updated_count!: number

  @Column({ type: "int", default: 0 })
  deleted_count!: number

  @Column({ type: "int", default: 0 })
  view_count!: number

  @Column({ type: "int", default: 0 })
  product_attachment_count!: number
}