-- CreateEnum
CREATE TYPE "EstablishmentTypes" AS ENUM ('hotel', 'house', 'kitnet', 'apartment');

-- AlterTable
ALTER TABLE "tb_users" ALTER COLUMN "complement" DROP NOT NULL;

-- CreateTable
CREATE TABLE "tb_establishments" (
    "id" TEXT NOT NULL,
    "type" "EstablishmentTypes" NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "street" VARCHAR(80) NOT NULL,
    "neighbourhood" VARCHAR(50) NOT NULL,
    "zipcode" VARCHAR(50) NOT NULL,
    "number" VARCHAR(20) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "state" VARCHAR(50) NOT NULL,
    "country" VARCHAR(50) NOT NULL,
    "complement" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "tb_establishments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_establishments" ADD CONSTRAINT "tb_establishments_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "tb_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
