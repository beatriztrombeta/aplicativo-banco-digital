/*
  Warnings:

  - The values [analista_qualidade_software] on the enum `Tipo_Cargo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Tipo_Cargo_new" AS ENUM ('engenheiro_de_software', 'desenvolvedor_back_end', 'desenvolvedor_mobile', 'desenvolvedor_front_end', 'designer', 'designer_ux_ui', 'analista_dados', 'analista_sistemas', 'arquiteto_software', 'analista_de_qualidade_de_software', 'suporte_tecnico', 'estagiario');
ALTER TABLE "Cliente" ALTER COLUMN "tipo" TYPE "Tipo_Cargo_new" USING ("tipo"::text::"Tipo_Cargo_new");
ALTER TYPE "Tipo_Cargo" RENAME TO "Tipo_Cargo_old";
ALTER TYPE "Tipo_Cargo_new" RENAME TO "Tipo_Cargo";
DROP TYPE "Tipo_Cargo_old";
COMMIT;
