/*
  Warnings:

  - You are about to alter the column `maxBookingHour` on the `tb_establishment_attatchments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(7)`.
  - You are about to alter the column `minBookingHour` on the `tb_establishment_attatchments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(7)`.

*/
-- AlterTable
ALTER TABLE "tb_establishment_attatchments" ALTER COLUMN "maxBookingHour" SET DATA TYPE VARCHAR(7),
ALTER COLUMN "minBookingHour" SET DATA TYPE VARCHAR(7);
