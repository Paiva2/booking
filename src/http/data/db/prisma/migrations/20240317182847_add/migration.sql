/*
  Warnings:

  - A unique constraint covering the columns `[id,booked_date]` on the table `tb_booked_dates` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[owner_id,name]` on the table `tb_establishments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `maxBookingHour` to the `tb_establishment_attatchments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minBookingHour` to the `tb_establishment_attatchments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_establishment_attatchments" ADD COLUMN     "maxBookingHour" TEXT NOT NULL,
ADD COLUMN     "minBookingHour" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tb_booked_dates_id_booked_date_key" ON "tb_booked_dates"("id", "booked_date");

-- CreateIndex
CREATE UNIQUE INDEX "tb_establishments_owner_id_name_key" ON "tb_establishments"("owner_id", "name");
