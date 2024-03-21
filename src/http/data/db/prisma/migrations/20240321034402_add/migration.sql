/*
  Warnings:

  - Added the required column `user_id` to the `tb_booked_dates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_booked_dates" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "tb_booked_dates" ADD CONSTRAINT "tb_booked_dates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
