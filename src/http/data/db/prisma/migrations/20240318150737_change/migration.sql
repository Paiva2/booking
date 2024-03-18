/*
  Warnings:

  - You are about to drop the column `establishment_attatchment_id` on the `tb_establishments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[establishment_id]` on the table `tb_establishment_attatchments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "tb_establishments" DROP CONSTRAINT "tb_establishments_establishment_attatchment_id_fkey";

-- AlterTable
ALTER TABLE "tb_establishments" DROP COLUMN "establishment_attatchment_id";

-- CreateIndex
CREATE UNIQUE INDEX "tb_establishment_attatchments_establishment_id_key" ON "tb_establishment_attatchments"("establishment_id");

-- AddForeignKey
ALTER TABLE "tb_establishment_attatchments" ADD CONSTRAINT "tb_establishment_attatchments_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "tb_establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
