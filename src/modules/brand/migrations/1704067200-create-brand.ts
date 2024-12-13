import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateBrand1704067200 implements MigrationInterface {
  name = "CreateBrand1704067200"

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create brand table
    await queryRunner.query(`
      CREATE TABLE "brand" (
        "id" character varying NOT NULL,
        "name" character varying NOT NULL,
        "description" character varying,
        "image" jsonb,
        "metadata" jsonb,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_brand" PRIMARY KEY ("id")
      )
    `)

    // Add brand_id to product table
    await queryRunner.query(`
      ALTER TABLE "product"
      ADD COLUMN "brand_id" character varying,
      ADD CONSTRAINT "FK_product_brand"
      FOREIGN KEY ("brand_id")
      REFERENCES "brand"("id")
      ON DELETE SET NULL
    `)

    // Add indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_brand_name" ON "brand" ("name")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key and column from product
    await queryRunner.query(`
      ALTER TABLE "product"
      DROP CONSTRAINT "FK_product_brand",
      DROP COLUMN "brand_id"
    `)

    // Drop brand table
    await queryRunner.query(`DROP TABLE "brand"`)
  }
}