/*
  Warnings:

  - You are about to drop the column `createdAt` on the `tb_establishments` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `tb_establishments` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tb_establishments` table. All the data in the column will be lost.
  - You are about to alter the column `zipcode` on the `tb_establishments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(30)`.
  - You are about to alter the column `state` on the `tb_establishments` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to drop the column `createdAt` on the `tb_users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tb_users` table. All the data in the column will be lost.
  - You are about to alter the column `number` on the `tb_users` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(20)`.
  - Added the required column `commodity_id` to the `tb_establishments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact` to the `tb_establishments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `tb_establishments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tb_establishments" DROP CONSTRAINT "tb_establishments_ownerId_fkey";

-- AlterTable
ALTER TABLE "tb_establishments" DROP COLUMN "createdAt",
DROP COLUMN "ownerId",
DROP COLUMN "updatedAt",
ADD COLUMN     "commodity_id" TEXT NOT NULL,
ADD COLUMN     "contact" VARCHAR(20) NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "owner_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "street" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "zipcode" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "state" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "tb_users" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "number" SET DATA TYPE VARCHAR(20);

-- CreateTable
CREATE TABLE "tb_establishment_images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "establishment_id" TEXT NOT NULL,

    CONSTRAINT "tb_establishment_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_commodities" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_commodities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_establishments" ADD CONSTRAINT "tb_establishments_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "tb_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_establishments" ADD CONSTRAINT "tb_establishments_commodity_id_fkey" FOREIGN KEY ("commodity_id") REFERENCES "tb_commodities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_establishment_images" ADD CONSTRAINT "tb_establishment_images_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "tb_establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
