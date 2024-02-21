/*
  Warnings:

  - Made the column `atualizado_em` on table `Cliente` required. This step will fail if there are existing NULL values in that column.
  - Made the column `atualizado_em` on table `Endereco` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cliente" ALTER COLUMN "atualizado_em" SET NOT NULL;

-- AlterTable
ALTER TABLE "Endereco" ALTER COLUMN "atualizado_em" SET NOT NULL;
