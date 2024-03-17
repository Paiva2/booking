/*
  Warnings:

  - You are about to drop the column `establishment_id` on the `tb_establishment_images` table. All the data in the column will be lost.
  - You are about to drop the column `commodity_id` on the `tb_establishments` table. All the data in the column will be lost.
  - Added the required column `establishment_attatchment_id` to the `tb_commodities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `establishment_attatchment_id` to the `tb_establishment_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `establishment_attatchment_id` to the `tb_establishments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tb_establishment_images" DROP CONSTRAINT "tb_establishment_images_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "tb_establishments" DROP CONSTRAINT "tb_establishments_commodity_id_fkey";

-- AlterTable
ALTER TABLE "tb_commodities" ADD COLUMN     "commodity_icon_url" TEXT,
ADD COLUMN     "establishment_attatchment_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tb_establishment_images" DROP COLUMN "establishment_id",
ADD COLUMN     "establishment_attatchment_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tb_establishments" DROP COLUMN "commodity_id",
ADD COLUMN     "establishment_attatchment_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "tb_establishment_attatchments" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "establishment_id" TEXT NOT NULL,

    CONSTRAINT "tb_establishment_attatchments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_booked_dates" (
    "id" TEXT NOT NULL,
    "booked_date" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "establishment_attatchment_id" TEXT NOT NULL,

    CONSTRAINT "tb_booked_dates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_establishments" ADD CONSTRAINT "tb_establishments_establishment_attatchment_id_fkey" FOREIGN KEY ("establishment_attatchment_id") REFERENCES "tb_establishment_attatchments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_establishment_images" ADD CONSTRAINT "tb_establishment_images_establishment_attatchment_id_fkey" FOREIGN KEY ("establishment_attatchment_id") REFERENCES "tb_establishment_attatchments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_commodities" ADD CONSTRAINT "tb_commodities_establishment_attatchment_id_fkey" FOREIGN KEY ("establishment_attatchment_id") REFERENCES "tb_establishment_attatchments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_booked_dates" ADD CONSTRAINT "tb_booked_dates_establishment_attatchment_id_fkey" FOREIGN KEY ("establishment_attatchment_id") REFERENCES "tb_establishment_attatchments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
