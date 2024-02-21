/*
  Warnings:

  - Added the required column `tipo` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Tipo_Cargo" AS ENUM ('engenheiro_de_software', 'desenvolvedor_back_end', 'desenvolvedor_mobile', 'desenvolvedor_front_end', 'designer', 'ux_ui_designer', 'analista_dados', 'analista_Sistemas', 'arquiteto_Software', 'analista_Qualidade_Software', 'suporte_Tecnico', 'estagiario');

-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "tipo" "Tipo_Cargo" NOT NULL;
