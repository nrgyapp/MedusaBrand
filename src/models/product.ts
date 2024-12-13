import { Column, Entity, ManyToOne, JoinColumn } from "typeorm"
import { Product as MedusaProduct } from "@medusajs/medusa"
import { Brand } from "../modules/brand/models/brand"

@Entity()
export class Product extends MedusaProduct {
  @Column({ nullable: true })
  brand_id: string

  @ManyToOne(() => Brand)
  @JoinColumn({ name: "brand_id" })
  brand: Brand
}