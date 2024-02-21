/*
  Warnings:

  - The values [analista_Sistemas,arquiteto_Software,analista_Qualidade_Software,suporte_Tecnico] on the enum `Tipo_Cargo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Tipo_Cargo_new" AS ENUM ('engenheiro_de_software', 'desenvolvedor_back_end', 'desenvolvedor_mobile', 'desenvolvedor_front_end', 'designer', 'ux_ui_designer', 'analista_dados', 'analista_sistemas', 'arquiteto_software', 'analista_qualidade_software', 'suporte_tecnico', 'estagiario');
ALTER TABLE "Cliente" ALTER COLUMN "tipo" TYPE "Tipo_Cargo_new" USING ("tipo"::text::"Tipo_Cargo_new");
ALTER TYPE "Tipo_Cargo" RENAME TO "Tipo_Cargo_old";
ALTER TYPE "Tipo_Cargo_new" RENAME TO "Tipo_Cargo";
DROP TYPE "Tipo_Cargo_old";
COMMIT;
