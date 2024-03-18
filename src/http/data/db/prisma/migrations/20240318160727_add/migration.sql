-- DropForeignKey
ALTER TABLE "tb_establishment_attatchments" DROP CONSTRAINT "tb_establishment_attatchments_establishment_id_fkey";

-- AddForeignKey
ALTER TABLE "tb_establishment_attatchments" ADD CONSTRAINT "tb_establishment_attatchments_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "tb_establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
