/*
  Warnings:

  - Added the required column `street` to the `tb_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_users" ADD COLUMN     "street" VARCHAR(100) NOT NULL;
