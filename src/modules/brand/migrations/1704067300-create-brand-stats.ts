import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateBrandStats1704067300 implements MigrationInterface {
  name = "CreateBrandStats1704067300"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "brand_stats" (
        "id" character varying NOT NULL,
        "brand_id" character varying NOT NULL,
        "month" character varying NOT NULL,
        "created_count" integer NOT NULL DEFAULT 0,
        "updated_count" integer NOT NULL DEFAULT 0,
        "deleted_count" integer NOT NULL DEFAULT 0,
        "view_count" integer NOT NULL DEFAULT 0,
        "product_attachment_count" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_brand_stats" PRIMARY KEY ("id")
      )
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_brand_stats_brand_id" ON "brand_stats" ("brand_id")
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_brand_stats_month" ON "brand_stats" ("month")
    `)

    await queryRunner.query(`
      ALTER TABLE "brand_stats"
      ADD CONSTRAINT "FK_brand_stats_brand"
      FOREIGN KEY ("brand_id")
      REFERENCES "brand"("id")
      ON DELETE CASCADE
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "brand_stats"
      DROP CONSTRAINT "FK_brand_stats_brand"
    `)

    await queryRunner.query(`DROP TABLE "brand_stats"`)
  }
}